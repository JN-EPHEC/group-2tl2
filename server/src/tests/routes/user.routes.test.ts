import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';

// ── Mocks (avant import de app) ────────────────────────────
jest.mock('../../models/User', () => ({
    __esModule: true,
    default: {
        findAll: jest.fn(),
        create:  jest.fn(),
        destroy: jest.fn(),
        update:  jest.fn(),
        findOne: jest.fn(),
    },
}));

jest.mock('../../models/Abonnement', () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn() },
}));

jest.mock('../../models/Forfait', () => ({
    __esModule: true,
    default: { findOrCreate: jest.fn() },
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
import app   from '../../app';
import User  from '../../models/User';
import bcrypt from 'bcrypt';
import jwt   from 'jsonwebtoken';

// ── Helper : simuler un token valide ──────────────────────
const fakePayload = { id: 1, email: 'admin@test.com', role: 'admin' };
const mockValidToken = () => {
    (jwt.verify as any).mockImplementation((_t: any, _s: any, cb: any) => cb(null, fakePayload));
};

// ── Tests GET /api/users ───────────────────────────────────
describe('GET /api/users', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 401 sans header Authorization', async () => {
        const res = await request(app).get('/api/users');
        expect(res.status).toBe(401);
    });

    it('retourne 403 avec un token invalide', async () => {
        (jwt.verify as any).mockImplementation((_t: any, _s: any, cb: any) =>
            cb(new Error('invalid token'), null)
        );
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', 'Bearer token_bidon');
        expect(res.status).toBe(403);
    });

    it('retourne 200 avec token valide et liste des utilisateurs', async () => {
        mockValidToken();
        (User.findAll as any).mockResolvedValue([
            { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', role: 'user' },
        ]);
        const res = await request(app)
            .get('/api/users')
            .set('Authorization', 'Bearer token_valide');
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});

// ── Tests POST /api/users ──────────────────────────────────
describe('POST /api/users', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 400 si body vide', async () => {
        const res = await request(app).post('/api/users').send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('retourne 400 si nom manquant', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ prenom: 'Jean', email: 'jean@test.com', motDePasse: 'Abc123!' });
        expect(res.status).toBe(400);
    });

    it('retourne 400 si motDePasse manquant', async () => {
        const res = await request(app)
            .post('/api/users')
            .send({ nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com' });
        expect(res.status).toBe(400);
    });

    it('retourne 201 si création réussie', async () => {
        (bcrypt.hash as any).mockResolvedValue('$2b$10$hashed');
        (User.create as any).mockResolvedValue({
            toJSON: () => ({
                id: 1, nom: 'Dupont', prenom: 'Jean',
                email: 'jean@test.com', role: 'user',
            }),
        });
        const res = await request(app)
            .post('/api/users')
            .send({ nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', motDePasse: 'Abc123!' });
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body).not.toHaveProperty('motDePasse'); // 🔒 Sécurité
    });

    it('retourne 409 si email déjà utilisé', async () => {
        (bcrypt.hash as any).mockResolvedValue('$hashed$');
        (User.create as any).mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });
        const res = await request(app)
            .post('/api/users')
            .send({ nom: 'Dupont', prenom: 'Jean', email: 'existe@test.com', motDePasse: 'Abc123!' });
        expect(res.status).toBe(409);
    });
});

// ── Tests DELETE /api/users/:id ────────────────────────────
describe('DELETE /api/users/:id', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 401 sans token', async () => {
        const res = await request(app).delete('/api/users/1');
        expect(res.status).toBe(401);
    });

    it('retourne 400 si id n\'est pas un entier', async () => {
        mockValidToken();
        const res = await request(app)
            .delete('/api/users/abc')
            .set('Authorization', 'Bearer token_valide');
        expect(res.status).toBe(400);
    });

    it('retourne 404 si utilisateur inexistant', async () => {
        mockValidToken();
        (User.destroy as any).mockResolvedValue(0);
        const res = await request(app)
            .delete('/api/users/999')
            .set('Authorization', 'Bearer token_valide');
        expect(res.status).toBe(404);
    });

    it('retourne 204 si suppression réussie', async () => {
        mockValidToken();
        (User.destroy as any).mockResolvedValue(1);
        const res = await request(app)
            .delete('/api/users/1')
            .set('Authorization', 'Bearer token_valide');
        expect(res.status).toBe(204);
    });
});
