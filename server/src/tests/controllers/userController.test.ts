import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// ── Mocks ──────────────────────────────────────────────────
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
    default: { findAll: jest.fn() },
}));

jest.mock('../../models/Forfait', () => ({
    __esModule: true,
    default: {},
}));

jest.mock('bcrypt', () => ({
    hash:    jest.fn(),
    compare: jest.fn(),
}));

// ── Imports après mocks ────────────────────────────────────
import { getAllUsers, createUser, deleteUser, updateUser } from '../../controllers/userController';
import User   from '../../models/User';
import bcrypt from 'bcrypt';

// ── Helper ─────────────────────────────────────────────────
const mockRes = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json   = jest.fn().mockReturnValue(res);
    res.send   = jest.fn().mockReturnValue(res);
    return res;
};

// ── getAllUsers() ──────────────────────────────────────────
describe('getAllUsers()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 200 avec la liste des utilisateurs', async () => {
        const fakeUsers = [
            { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', role: 'user' },
            { id: 2, nom: 'Martin', prenom: 'Alice', email: 'alice@test.com', role: 'admin' },
        ];
        (User.findAll as any).mockResolvedValue(fakeUsers);

        const req = {} as any;
        const res = mockRes();
        await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(fakeUsers);
    });

    it('retourne 500 en cas d\'erreur base de données', async () => {
        (User.findAll as any).mockRejectedValue(new Error('DB error'));

        const req = {} as any;
        const res = mockRes();
        await getAllUsers(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ── createUser() ───────────────────────────────────────────
describe('createUser()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 400 si tous les champs requis sont manquants', async () => {
        const req = { body: {} } as any;
        const res = mockRes();
        await createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retourne 400 si prenom manquant', async () => {
        const req = { body: { nom: 'Dupont', email: 'a@b.com', motDePasse: 'Abc123!' } } as any;
        const res = mockRes();
        await createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retourne 400 si email manquant', async () => {
        const req = { body: { nom: 'Dupont', prenom: 'Jean', motDePasse: 'Abc123!' } } as any;
        const res = mockRes();
        await createUser(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    });

    it('retourne 201 avec utilisateur créé (sans motDePasse)', async () => {
        (bcrypt.hash as any).mockResolvedValue('$2b$10$hashedpassword');
        (User.create as any).mockResolvedValue({
            toJSON: () => ({
                id: 1, nom: 'Dupont', prenom: 'Jean',
                email: 'jean@test.com', motDePasse: '$2b$10$hashedpassword',
                role: 'user', actif: true,
            }),
        });

        const req = { body: { nom: 'Dupont', prenom: 'Jean', email: 'jean@test.com', motDePasse: 'Abc123!' } } as any;
        const res = mockRes();
        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        const payload = (res.json as any).mock.calls[0][0];
        expect(payload).not.toHaveProperty('motDePasse'); // 🔒 Sécurité
    });

    it('le mot de passe est hashé avant insertion en base', async () => {
        (bcrypt.hash as any).mockResolvedValue('$2b$10$hashedpassword');
        (User.create as any).mockResolvedValue({
            toJSON: () => ({ id: 1, nom: 'A', prenom: 'B', email: 'a@b.com' }),
        });

        const req = { body: { nom: 'A', prenom: 'B', email: 'a@b.com', motDePasse: 'Abc123!' } } as any;
        const res = mockRes();
        await createUser(req, res);

        expect(bcrypt.hash).toHaveBeenCalledWith('Abc123!', 10);
        const createArg = (User.create as any).mock.calls[0][0];
        expect(createArg.motDePasse).toBe('$2b$10$hashedpassword');
        expect(createArg.motDePasse).not.toBe('Abc123!');
    });

    it('retourne 409 si email déjà utilisé', async () => {
        (bcrypt.hash as any).mockResolvedValue('$hashed$');
        (User.create as any).mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

        const req = { body: { nom: 'Dupont', prenom: 'Jean', email: 'existe@test.com', motDePasse: 'Abc123!' } } as any;
        const res = mockRes();
        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(409);
    });

    it('retourne 500 en cas d\'erreur inattendue', async () => {
        (bcrypt.hash as any).mockResolvedValue('$hashed$');
        (User.create as any).mockRejectedValue(new Error('Connexion perdue'));

        const req = { body: { nom: 'A', prenom: 'B', email: 'a@b.com', motDePasse: 'Abc123!' } } as any;
        const res = mockRes();
        await createUser(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ── deleteUser() ───────────────────────────────────────────
describe('deleteUser()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 404 si l\'utilisateur n\'existe pas', async () => {
        (User.destroy as any).mockResolvedValue(0);
        const req = { params: { id: '999' } } as any;
        const res = mockRes();
        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    });

    it('retourne 204 si suppression réussie', async () => {
        (User.destroy as any).mockResolvedValue(1);
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(204);
    });

    it('retourne 500 en cas d\'erreur base de données', async () => {
        (User.destroy as any).mockRejectedValue(new Error('DB error'));
        const req = { params: { id: '1' } } as any;
        const res = mockRes();
        await deleteUser(req, res);
        expect(res.status).toHaveBeenCalledWith(500);
    });
});

// ── updateUser() ───────────────────────────────────────────
describe('updateUser()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('retourne 200 si mise à jour réussie', async () => {
        (User.update as any).mockResolvedValue([1]);
        const req = { params: { id: '1' }, body: { nom: 'NouveauNom' } } as any;
        const res = mockRes();
        await updateUser(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    });

    it('hashe le mot de passe si inclus dans la mise à jour', async () => {
        (bcrypt.hash as any).mockResolvedValue('$nouveau_hash$');
        (User.update as any).mockResolvedValue([1]);
        const req = { params: { id: '1' }, body: { motDePasse: 'NouveauMdp1!' } } as any;
        const res = mockRes();
        await updateUser(req, res);
        expect(bcrypt.hash).toHaveBeenCalledWith('NouveauMdp1!', 10);
        const updateArg = (User.update as any).mock.calls[0][0];
        expect(updateArg.motDePasse).toBe('$nouveau_hash$');
    });
});
