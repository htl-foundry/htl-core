export interface HTLEntropyReport {
    sampleCount: number;
    meanFlight: number;
    stdDevFlight: number;
    shannonEntropy: number;
    meanDwell: number;
    dwellSampleCount: number;
    captureMode: 'tap' | 'input';
    isHumanLikely: boolean;
    capturedAt: number;
}
type ReportCallback = (report: HTLEntropyReport) => void;
export declare class HTLKeystrokeTracker {
    private readonly target;
    private readonly sampleSize;
    private readonly onReport;
    private flightTimes;
    private dwellTimes;
    private lastInputAt;
    private lastTapAt;
    private tapMode;
    private readonly downAt;
    private active;
    constructor(target: EventTarget, sampleSize: number, onReport: ReportCallback);
    get capturedCount(): number;
    private readonly handleKeyDown;
    private readonly handleKeyUp;
    private readonly handleInput;
    private maybeFinalize;
    private buildReport;
    private mean;
    private stdDev;
    private entropy;
    destroy(): void;
}
export {};
