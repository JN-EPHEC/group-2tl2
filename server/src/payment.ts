// --- 1. L'interface attendue par notre application ---
export interface IPaymentProcessor {
  pay(amountInEuros: number): void;
}

// --- 2. Ancien système (Compatible avec notre interface) ---
export class LegacyPaypal implements IPaymentProcessor {
  public pay(amountInEuros: number): void {
    console.log(`Paiement de ${amountInEuros}€ via Paypal (Legacy).`);
  }
}

// --- 3. NOUVEAU système externe (INCOMPATIBLE !) ---
// Cette classe provient d'une librairie externe (ex: Stripe), on ne peut pas la modifier.
export class StripeModernAPI {
  public charge(amountInCents: number, currency: string): void {
    console.log(`[Stripe API] Paiement de ${amountInCents / 100} ${currency} effectué avec succès.`);
  }
}

// --- 4. Notre service métier (Le "Client") ---
export class CheckoutService {
  private paymentProcessor: IPaymentProcessor;

  constructor(processor: IPaymentProcessor) {
    this.paymentProcessor = processor;
  }

  public checkout(cartTotal: number): void {
    console.log("Validation du panier en cours...");
    // Le service ne sait utiliser QUE la méthode pay()
    this.paymentProcessor.pay(cartTotal);
  }
}

// ==========================================================
// --- 5. PARTIE EXÉCUTION (MISE À JOUR AVEC ADAPTER) ---
// ==========================================================
import { StripeAdapter } from "./services/stripeAdapter";

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
const stripeAdapter = new StripeAdapter(stripeModern);

// 3. On donne l'adaptateur au CheckoutService
// Cela fonctionne car StripeAdapter implémente IPaymentProcessor
const checkoutStripe = new CheckoutService(stripeAdapter);

// 4. On prouve que l'application fonctionne sans avoir modifié CheckoutService
checkoutStripe.checkout(75);