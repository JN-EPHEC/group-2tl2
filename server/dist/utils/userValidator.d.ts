/**
 * Valide l'inscription d'un utilisateur selon son âge
 * * @param age - Doit être un nombre valide <= 120.
 * @param role - Doit être "admin", "user" ou "stagiaire".
 * @param email - Doit contenir un '@' et un '.'.
 * @returns boolean
 * @throws Error - Si l'âge > 120
 */
export declare const validateUserRegistration: (age: number, role: string, email: string) => boolean;
//# sourceMappingURL=userValidator.d.ts.map