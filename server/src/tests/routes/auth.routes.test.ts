import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';

// ── Mocks (avant import de app) ────────────────────────────
jest.mock('../../models/User', () => ({
    __esModule: true,
    default: { findOne: jest.fn() },
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

// ── Tests POST /api/auth/login ─────────────────────────────
describe('POST /api/auth/login', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 400 si body vide', async () => {
        const res = await request(app).post('/api/auth/login').send({});
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('retourne 400 si email manquant', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ password: 'Abc123!' });
        expect(res.status).toBe(400);
    });

    it('retourne 400 si password manquant', async () => {
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com' });
        expect(res.status).toBe(400);
    });

    it('retourne 401 si utilisateur non trouvé', async () => {
        (User.findOne as any).mockResolvedValue(null);
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'inconnu@test.com', password: 'Abc123!' });
        expect(res.status).toBe(401);
    });

    it('retourne 401 si mot de passe incorrect', async () => {
        (User.findOne as any).mockResolvedValue({
            id: 1, email: 'test@test.com', motDePasse: '$hashed$', role: 'user', isAdmin: false,
        });
        (bcrypt.compare as any).mockResolvedValue(false);
        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'mauvais' });
        expect(res.status).toBe(401);
    });

    it('retourne 200 avec accessToken si login valide', async () => {
        (User.findOne as any).mockResolvedValue({
            id: 1, email: 'test@test.com', nom: 'Dupont', prenom: 'Jean',
            role: 'user', isAdmin: false, motDePasse: '$hashed$',
        });
        (bcrypt.compare as any).mockResolvedValue(true);
        (jwt.sign as any).mockReturnValue('fake_jwt_token');

        const res = await request(app)
            .post('/api/auth/login')
            .send({ email: 'test@test.com', password: 'Abc123!' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body).toHaveProperty('user');
        expect(res.body.user).not.toHaveProperty('motDePasse');
    });
});

// ── Tests POST /api/auth/logout ────────────────────────────
describe('POST /api/auth/logout', () => {
    it('retourne 200 et un message de confirmation', async () => {
        const res = await request(app).post('/api/auth/logout');
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('message');
    });
});
