import { validatePassword } from "./password";

describe("Password Validator - Final 100%", () => {
  it("Tests de base", () => {
    expect(validatePassword("", 20)).toBe(false);
    expect(validatePassword("abc", 20)).toBe(false);
    expect(validatePassword("a".repeat(21), 20)).toBe(false);
  });

  it("Tests Enfant", () => {
    expect(validatePassword("ABCDEF12!", 5)).toBe(false);
    expect(validatePassword("abcdef12!", 5)).toBe(true);
  });

  it("Tests Adulte", () => {
    expect(validatePassword("abc12345!", 30)).toBe(false); // Manque Maj
    expect(validatePassword("ABC12345!", 30)).toBe(false); // Manque min
    expect(validatePassword("Abcdefgh!", 30)).toBe(false); // Manque chiffre
    expect(validatePassword("Abc123456", 30)).toBe(false); // Manque spécial
    expect(validatePassword("Abc12345!", 30)).toBe(true);  // OK
  });

  it("Tests Senior (Ligne 21)", () => {
    // Cas 1 : Tout faux -> Rejet
    expect(validatePassword("minuscule!", 70)).toBe(false); 
    
    // Cas 2 : Majuscule présente -> Succès
    expect(validatePassword("Majuscule!", 70)).toBe(true);
    
    // Cas 3 : Chiffre présent -> Succès
    expect(validatePassword("chiffre123!", 70)).toBe(true);
  });
});