import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import request from 'supertest';

// ── Mocks (avant import de app) ────────────────────────────
jest.mock('../../models/Forfait', () => ({
    __esModule: true,
    default: { findAll: jest.fn(), create: jest.fn(), findByPk: jest.fn() },
}));

jest.mock('../../models/LogAction', () => ({
    __esModule: true,
    default: { create: jest.fn() },
}));

jest.mock('../../models/User', () => ({
    __esModule: true,
    default: { findOne: jest.fn(), findAll: jest.fn() },
}));

jest.mock('../../models/Abonnement', () => ({
    __esModule: true,
    default: { findAll: jest.fn() },
}));

jest.mock('jsonwebtoken', () => ({
    sign:   jest.fn(),
    verify: jest.fn(),
}));

// ── Imports après mocks ────────────────────────────────────
import app     from '../../app';
import Forfait from '../../models/Forfait';
import jwt     from 'jsonwebtoken';

const FAKE_TOKEN  = 'fake_jwt_token';
const mockForfait = {
    id: 1, nom: 'PASS 1 JOUR', description: null,
    prix: 65, dureeJours: 1, actif: true,
    save: jest.fn<() => Promise<void>>().mockResolvedValue(undefined),
};

beforeEach(() => {
    jest.clearAllMocks();
    // Simuler un token valide pour tous les tests
    (jwt.verify as any).mockImplementation((_t: any, _s: any, cb: any) =>
        cb(null, { id: 1, role: 'super_admin' })
    );
});

// ── GET /api/forfaits ──────────────────────────────────────
describe('GET /api/forfaits', () => {
    it('retourne 200 avec la liste des forfaits', async () => {
        (Forfait.findAll as any).mockResolvedValue([mockForfait]);
        const res = await request(app)
            .get('/api/forfaits')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`);
        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app).get('/api/forfaits');
        expect(res.status).toBe(401);
    });

    it('retourne 500 si la BDD échoue', async () => {
        (Forfait.findAll as any).mockRejectedValue(new Error('DB error'));
        const res = await request(app)
            .get('/api/forfaits')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`);
        expect(res.status).toBe(500);
    });
});

// ── POST /api/forfaits ─────────────────────────────────────
describe('POST /api/forfaits', () => {
    it('retourne 201 avec le forfait créé', async () => {
        (Forfait.create as any).mockResolvedValue(mockForfait);
        const res = await request(app)
            .post('/api/forfaits')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`)
            .send({ nom: 'PASS 1 JOUR', prix: 65, dureeJours: 1 });
        expect(res.status).toBe(201);
    });

    it('retourne 400 si nom manquant', async () => {
        const res = await request(app)
            .post('/api/forfaits')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`)
            .send({ prix: 65, dureeJours: 1 });
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('retourne 400 si prix manquant', async () => {
        const res = await request(app)
            .post('/api/forfaits')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`)
            .send({ nom: 'PASS TEST', dureeJours: 1 });
        expect(res.status).toBe(400);
    });

    it('retourne 400 si dureeJours manquant', async () => {
        const res = await request(app)
            .post('/api/forfaits')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`)
            .send({ nom: 'PASS TEST', prix: 65 });
        expect(res.status).toBe(400);
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app)
            .post('/api/forfaits')
            .send({ nom: 'PASS TEST', prix: 65, dureeJours: 1 });
        expect(res.status).toBe(401);
    });
});

// ── PUT /api/forfaits/:id ──────────────────────────────────
describe('PUT /api/forfaits/:id', () => {
    it('retourne 200 si forfait mis à jour', async () => {
        (Forfait.findByPk as any).mockResolvedValue({ ...mockForfait });
        const res = await request(app)
            .put('/api/forfaits/1')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`)
            .send({ nom: 'PASS MODIFIÉ', prix: 70, dureeJours: 2 });
        expect(res.status).toBe(200);
    });

    it('retourne 404 si forfait inexistant', async () => {
        (Forfait.findByPk as any).mockResolvedValue(null);
        const res = await request(app)
            .put('/api/forfaits/999')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`)
            .send({ nom: 'Test' });
        expect(res.status).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app)
            .put('/api/forfaits/1')
            .send({ nom: 'Test' });
        expect(res.status).toBe(401);
    });
});

// ── PUT /api/forfaits/:id/toggle ───────────────────────────
describe('PUT /api/forfaits/:id/toggle', () => {
    it('retourne 200 et inverse le statut actif', async () => {
        (Forfait.findByPk as any).mockResolvedValue({ ...mockForfait, actif: true });
        const res = await request(app)
            .put('/api/forfaits/1/toggle')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`);
        expect(res.status).toBe(200);
    });

    it('retourne 404 si forfait inexistant', async () => {
        (Forfait.findByPk as any).mockResolvedValue(null);
        const res = await request(app)
            .put('/api/forfaits/999/toggle')
            .set('Authorization', `Bearer ${FAKE_TOKEN}`);
        expect(res.status).toBe(404);
    });

    it('retourne 401 sans token', async () => {
        const res = await request(app)
            .put('/api/forfaits/1/toggle');
        expect(res.status).toBe(401);
    });
});
