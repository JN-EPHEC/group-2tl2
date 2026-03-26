"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const password_1 = require("./password");
describe("Password Validator - Final 100%", () => {
    it("Tests de base", () => {
        expect((0, password_1.validatePassword)("", 20)).toBe(false);
        expect((0, password_1.validatePassword)("abc", 20)).toBe(false);
        expect((0, password_1.validatePassword)("a".repeat(21), 20)).toBe(false);
    });
    it("Tests Enfant", () => {
        expect((0, password_1.validatePassword)("ABCDEF12!", 5)).toBe(false);
        expect((0, password_1.validatePassword)("abcdef12!", 5)).toBe(true);
    });
    it("Tests Adulte", () => {
        expect((0, password_1.validatePassword)("abc12345!", 30)).toBe(false); // Manque Maj
        expect((0, password_1.validatePassword)("ABC12345!", 30)).toBe(false); // Manque min
        expect((0, password_1.validatePassword)("Abcdefgh!", 30)).toBe(false); // Manque chiffre
        expect((0, password_1.validatePassword)("Abc123456", 30)).toBe(false); // Manque spécial
        expect((0, password_1.validatePassword)("Abc12345!", 30)).toBe(true); // OK
    });
    it("Tests Senior (Ligne 21)", () => {
        // Cas 1 : Tout faux -> Rejet
        expect((0, password_1.validatePassword)("minuscule!", 70)).toBe(false);
        // Cas 2 : Majuscule présente -> Succès
        expect((0, password_1.validatePassword)("Majuscule!", 70)).toBe(true);
        // Cas 3 : Chiffre présent -> Succès
        expect((0, password_1.validatePassword)("chiffre123!", 70)).toBe(true);
    });
});
//# sourceMappingURL=password.test.js.map