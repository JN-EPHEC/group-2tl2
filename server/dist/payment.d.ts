export interface IPaymentProcessor {
    pay(amountInEuros: number): void;
}
export declare class LegacyPaypal implements IPaymentProcessor {
    pay(amountInEuros: number): void;
}
export declare class StripeModernAPI {
    charge(amountInCents: number, currency: string): void;
}
export declare class CheckoutService {
    private paymentProcessor;
    constructor(processor: IPaymentProcessor);
    checkout(cartTotal: number): void;
}
//# sourceMappingURL=payment.d.ts.map