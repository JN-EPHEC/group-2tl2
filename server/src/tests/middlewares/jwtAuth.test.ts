import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ── Mock jsonwebtoken ──────────────────────────────────────
jest.mock('jsonwebtoken', () => ({
    sign:   jest.fn(),
    verify: jest.fn(),
}));

// ── Imports après mocks ────────────────────────────────────
import { authenticateToken } from '../../middlewares/jwtAuth';
import jwt from 'jsonwebtoken';

// ── Helper ─────────────────────────────────────────────────
const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    return res;
};

// ── Tests ──────────────────────────────────────────────────
describe('authenticateToken()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 401 si aucun header Authorization', () => {
        const req  = { headers: {} } as any;
        const res  = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: expect.any(String) })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('retourne 401 si header Authorization présent mais vide', () => {
        const req  = { headers: { authorization: 'Bearer ' } } as any;
        const res  = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(next).not.toHaveBeenCalled();
    });

    it('retourne 403 si token invalide ou expiré', () => {
        (jwt.verify as any).mockImplementation((_token: any, _secret: any, cb: any) => {
            cb(new Error('jwt expired'), null);
        });

        const req  = { headers: { authorization: 'Bearer token_invalide' } } as any;
        const res  = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: expect.any(String) })
        );
        expect(next).not.toHaveBeenCalled();
    });

    it('retourne 403 si token malformé', () => {
        (jwt.verify as any).mockImplementation((_token: any, _secret: any, cb: any) => {
            cb(new Error('jwt malformed'), null);
        });

        const req  = { headers: { authorization: 'Bearer mauvais.token.ici' } } as any;
        const res  = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });

    it('appelle next() si le token est valide', () => {
        const fakePayload = { id: 1, email: 'test@test.com', role: 'user' };
        (jwt.verify as any).mockImplementation((_token: any, _secret: any, cb: any) => {
            cb(null, fakePayload);
        });

        const req  = { headers: { authorization: 'Bearer token_valide' } } as any;
        const res  = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(next).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('attache le payload décodé à req.user si token valide', () => {
        const fakePayload = { id: 42, email: 'admin@test.com', role: 'admin' };
        (jwt.verify as any).mockImplementation((_token: any, _secret: any, cb: any) => {
            cb(null, fakePayload);
        });

        const req  = { headers: { authorization: 'Bearer token_valide' } } as any;
        const res  = mockRes();
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(req.user).toEqual(fakePayload);
        expect(req.user.id).toBe(42);
        expect(req.user.role).toBe('admin');
    });
});
