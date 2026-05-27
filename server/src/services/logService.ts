import LogAction from '../models/LogAction';

/**
 * Enregistre une action admin en base de données.
 * Ne lève jamais d'erreur — un échec de log ne doit jamais bloquer la requête principale.
 */
export const log = async (
    utilisateurId: number,
    action: string,
    detail: string | null,
    ipAddress: string | null
): Promise<void> => {
    try {
        await LogAction.create({ utilisateurId, action, detail, ipAddress });
    } catch (err) {
        console.error('[LogService] Erreur lors de l\'enregistrement du log :', err);
    }
};
