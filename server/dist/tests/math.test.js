"use strict";
const add = (a, b) => a + b;
describe('Math Utils', () => {
    it('devrait additionner deux nombres correctement', () => {
        const result = add(2, 3);
        expect(result).toBe(5);
    });
    it('devrait gérer les nombres négatifs', () => {
        expect(add(-1, -1)).toBe(-2);
    });
});
//# sourceMappingURL=math.test.js.map