"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserRegistration = void 0;
/**
 * Valide l'inscription d'un utilisateur selon son âge
 * * @param age - Doit être un nombre valide <= 120.
 * @param role - Doit être "admin", "user" ou "stagiaire".
 * @param email - Doit contenir un '@' et un '.'.
 * @returns boolean
 * @throws Error - Si l'âge > 120
 */
const validateUserRegistration = (age, role, email) => {
    // Validation de l'âge 
    if (typeof age !== "number" || isNaN(age)) {
        return false;
    }
    if (age > 120) {
        throw new Error("Âge invalide");
    }
    // Validation du rôle (Spécifications strictes)
    const validRoles = ["admin", "user", "stagiaire"];
    if (!validRoles.includes(role)) {
        throw new Error("Rôle invalide");
    }
    // Logique d'inscription selon l'âge et le rôle
    if (age < 18) {
        if (role !== "stagiaire") {
            return false; // Refusé si mineur et pas stagiaire
        }
    }
    // Validation de l'Email 
    if (!email.includes("@") || !email.includes(".")) {
        return false;
    }
    return true;
};
exports.validateUserRegistration = validateUserRegistration;
//# sourceMappingURL=userValidator.js.map