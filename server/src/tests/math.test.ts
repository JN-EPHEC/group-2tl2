const add = (a: number, b: number) => a + b;

describe('Math Utils', () => {
  it('devrait additionner deux nombres correctement', () => {
    // Arrange (Préparer) : pas besoin ici, les données sont simples
    // Act (Agir)
    const result = add(2, 3);
    // Assert (Vérifier)
    expect(result).toBe(5);
  });

  it('devrait gérer les nombres négatifs', () => {
    expect(add(-1, -1)).toBe(-2);
  });
});