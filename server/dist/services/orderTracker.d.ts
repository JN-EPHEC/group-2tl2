interface IOrderObserver {
    update(status: string): void;
}
export declare class OrderTracker {
    private observers;
    private status;
    attach(observer: IOrderObserver): void;
    private notifyObservers;
    setStatus(newStatus: string): void;
}
export {};
//# sourceMappingURL=orderTracker.d.ts.map