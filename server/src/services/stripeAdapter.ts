import { IPaymentProcessor, StripeModernAPI } from "../payment";

export class StripeAdapter implements IPaymentProcessor {
    private stripeService: StripeModernAPI;

    constructor(stripeService: StripeModernAPI) {
        this.stripeService = stripeService;
    }

    public pay(amountInEuros: number): void {
        const amountInCents = amountInEuros * 100;
        this.stripeService.charge(amountInCents, "EUR");
        console.log(`[ADAPTER] Conversion réussie : ${amountInEuros}€ en ${amountInCents} cents.`);
    }
}