import { IPaymentProcessor, StripeModernAPI } from "../payment";
export declare class StripeAdapter implements IPaymentProcessor {
    private stripeService;
    constructor(stripeService: StripeModernAPI);
    pay(amountInEuros: number): void;
}
//# sourceMappingURL=stripeAdapter.d.ts.map