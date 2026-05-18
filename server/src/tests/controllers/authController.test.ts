import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ── Mocks (doivent être avant les imports des modules mockés) ──
jest.mock('../../models/User', () => ({
    __esModule: true,
    default: {
        findOne: jest.fn(),
    },
}));

jest.mock('bcrypt', () => ({
    compare: jest.fn(),
    hash:    jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign:   jest.fn(),
    verify: jest.fn(),
}));

// ── Imports après mocks ────────────────────────────────────
import { login, logout } from '../../controllers/authController';
import User              from '../../models/User';
import bcrypt            from 'bcrypt';
import jwt               from 'jsonwebtoken';

// ── Helper ─────────────────────────────────────────────────
const mockRes = () => {
    const res: any = {};
    res.status      = jest.fn().mockReturnValue(res);
    res.json        = jest.fn().mockReturnValue(res);
    res.cookie      = jest.fn().mockReturnValue(res);
    res.clearCookie = jest.fn().mockReturnValue(res);
    return res;
};

// ── Tests login() ──────────────────────────────────────────
describe('login()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 400 si email manquant', async () => {
        const req = { body: { password: 'pass123' } } as any;
        const res = mockRes();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ error: expect.any(String) })
        );
    });

    it('retourne 400 si password manquant', async () => {
        const req = { body: { email: 'test@test.com' } } as any;
        const res = mockRes();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retourne 400 si body vide', async () => {
        const req = { body: {} } as any;
        const res = mockRes();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retourne 401 si utilisateur non trouvé en base', async () => {
        (User.findOne as any).mockResolvedValue(null);
        const req = { body: { email: 'inconnu@test.com', password: 'pass' } } as any;
        const res = mockRes();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('retourne 401 si mot de passe incorrect', async () => {
        (User.findOne as any).mockResolvedValue({
            id: 1, email: 'test@test.com', motDePasse: '$hashed$', role: 'user', isAdmin: false,
        });
        (bcrypt.compare as any).mockResolvedValue(false);
        const req = { body: { email: 'test@test.com', password: 'mauvais_mdp' } } as any;
        const res = mockRes();
        await login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
    });

    it('retourne 200 avec accessToken si credentials valides', async () => {
        const fakeUser = {
            id: 1, email: 'test@test.com', nom: 'Dupont', prenom: 'Jean',
            role: 'user', isAdmin: false, motDePasse: '$hashed$',
        };
        (User.findOne as any).mockResolvedValue(fakeUser);
        (bcrypt.compare as any).mockResolvedValue(true);
        (jwt.sign as any).mockReturnValue('fake_access_token');

        const req = { body: { email: 'test@test.com', password: 'Abc123!' } } as any;
        const res = mockRes();
        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ accessToken: 'fake_access_token' })
        );
    });

    it('login valide : la réponse contient les infos utilisateur (sans motDePasse)', async () => {
        const fakeUser = {
            id: 1, email: 'test@test.com', nom: 'Dupont', prenom: 'Jean',
            role: 'user', isAdmin: false, motDePasse: '$hashed$',
        };
        (User.findOne as any).mockResolvedValue(fakeUser);
        (bcrypt.compare as any).mockResolvedValue(true);
        (jwt.sign as any).mockReturnValue('token');

        const req = { body: { email: 'test@test.com', password: 'Abc123!' } } as any;
        const res = mockRes();
        await login(req, res);

        const payload = (res.json as any).mock.calls[0][0];
        expect(payload.user).toHaveProperty('id', 1);
        expect(payload.user).toHaveProperty('email', 'test@test.com');
        expect(payload.user).not.toHaveProperty('motDePasse');
    });
});

// ── Tests logout() ─────────────────────────────────────────
describe('logout()', () => {
    it('efface le cookie refreshToken et retourne 200', () => {
        const req = {} as any;
        const res = mockRes();
        logout(req, res);
        expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({ message: expect.any(String) })
        );
    });
});
