import { describe, it, expect, jest, beforeEach } from '@jest/globals';

// ── Mock LogAction avant tout import ───────────────────────
jest.mock('../../models/LogAction', () => ({
    __esModule: true,
    default: { create: jest.fn() },
}));

import { log } from '../../services/logService';
import LogAction from '../../models/LogAction';

describe('logService.log()', () => {
    beforeEach(() => { jest.clearAllMocks(); });

    it('appelle LogAction.create avec les bons arguments', async () => {
        (LogAction.create as any).mockResolvedValue({});
        await log(1, 'CREATE_FORFAIT', 'PASS 1 JOUR — 65€ — 1j', '127.0.0.1');
        expect(LogAction.create).toHaveBeenCalledWith({
            utilisateurId: 1,
            action:        'CREATE_FORFAIT',
            detail:        'PASS 1 JOUR — 65€ — 1j',
            ipAddress:     '127.0.0.1',
        });
    });

    it('accepte detail et ipAddress null', async () => {
        (LogAction.create as any).mockResolvedValue({});
        await log(2, 'DELETE_USER', null, null);
        expect(LogAction.create).toHaveBeenCalledWith({
            utilisateurId: 2,
            action:        'DELETE_USER',
            detail:        null,
            ipAddress:     null,
        });
    });

    it('ne lève pas d\'erreur si LogAction.create échoue', async () => {
        (LogAction.create as any).mockRejectedValue(new Error('DB error'));
        await expect(log(1, 'TOGGLE_FORFAIT', null, null)).resolves.toBeUndefined();
    });

    it('ne lève pas d\'erreur si utilisateurId est undefined', async () => {
        (LogAction.create as any).mockResolvedValue({});
        await expect(log(undefined as any, 'CHANGE_ROLE', 'User #3 → moderateur', null)).resolves.toBeUndefined();
    });
});
