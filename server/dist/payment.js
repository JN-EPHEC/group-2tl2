"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutService = exports.StripeModernAPI = exports.LegacyPaypal = void 0;
// --- 2. Ancien système (Compatible avec notre interface) ---
class LegacyPaypal {
    pay(amountInEuros) {
        console.log(`Paiement de ${amountInEuros}€ via Paypal (Legacy).`);
    }
}
exports.LegacyPaypal = LegacyPaypal;
// --- 3. NOUVEAU système externe (INCOMPATIBLE !) ---
// Cette classe provient d'une librairie externe (ex: Stripe), on ne peut pas la modifier.
class StripeModernAPI {
    charge(amountInCents, currency) {
        console.log(`[Stripe API] Paiement de ${amountInCents / 100} ${currency} effectué avec succès.`);
    }
}
exports.StripeModernAPI = StripeModernAPI;
// --- 4. Notre service métier (Le "Client") ---
class CheckoutService {
    paymentProcessor;
    constructor(processor) {
        this.paymentProcessor = processor;
    }
    checkout(cartTotal) {
        console.log("Validation du panier en cours...");
        // Le service ne sait utiliser QUE la méthode pay()
        this.paymentProcessor.pay(cartTotal);
    }
}
exports.CheckoutService = CheckoutService;
// ==========================================================
// --- 5. PARTIE EXÉCUTION (MISE À JOUR AVEC ADAPTER) ---
// ==========================================================
const stripeAdapter_1 = require("./services/stripeAdapter");
// --- TEST AVEC PAYPAL (Ancien système) ---
console.log("--- Test Paypal ---");
const paypalProcessor = new LegacyPaypal();
const checkoutPaypal = new CheckoutService(paypalProcessor);
checkoutPaypal.checkout(50);
console.log("\n--- Test Stripe via Adapter ---");
// --- TEST AVEC STRIPE (Nouveau système via Adaptateur) ---
// 1. On crée la librairie moderne (l'objet à adapter)
const stripeModern = new StripeModernAPI();
// 2. On l'enveloppe dans l'adaptateur (le traducteur)
const stripeAdapter = new stripeAdapter_1.StripeAdapter(stripeModern);
// 3. On donne l'adaptateur au CheckoutService
// Cela fonctionne car StripeAdapter implémente IPaymentProcessor
const checkoutStripe = new CheckoutService(stripeAdapter);
// 4. On prouve que l'application fonctionne sans avoir modifié CheckoutService
checkoutStripe.checkout(75);
//# sourceMappingURL=payment.js.map