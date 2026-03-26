"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeAdapter = void 0;
class StripeAdapter {
    stripeService;
    constructor(stripeService) {
        this.stripeService = stripeService;
    }
    pay(amountInEuros) {
        const amountInCents = amountInEuros * 100;
        this.stripeService.charge(amountInCents, "EUR");
        console.log(`[ADAPTER] Conversion réussie : ${amountInEuros}€ en ${amountInCents} cents.`);
    }
}
exports.StripeAdapter = StripeAdapter;
//# sourceMappingURL=stripeAdapter.js.map