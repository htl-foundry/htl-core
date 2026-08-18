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

export class HTLKeystrokeTracker {
  private readonly target: EventTarget;
  private readonly sampleSize: number;
  private readonly onReport: ReportCallback;

  private flightTimes: number[] = [];
  private dwellTimes: number[] = [];
  private lastInputAt = 0;
  private lastTapAt = 0;
  private tapMode = false;
  private readonly downAt = new Map<string, number>();
  private active = true;

  constructor(target: EventTarget, sampleSize: number, onReport: ReportCallback) {
    this.target = target;
    this.sampleSize = sampleSize;
    this.onReport = onReport;
    this.target.addEventListener('input', this.handleInput);
    this.target.addEventListener('keydown', this.handleKeyDown);
    this.target.addEventListener('keyup', this.handleKeyUp);
  }

  public get capturedCount(): number {
    return this.flightTimes.length;
  }

  private readonly handleKeyDown = (e: Event): void => {
    if (!this.active) return;
    const ke = e as KeyboardEvent;
    if (ke.repeat) return;
    if (ke.key === 'Unidentified') {
      this.tapMode = true;
      const now = performance.now();
      if (this.lastTapAt > 0) {
        this.flightTimes.push(now - this.lastTapAt);
      }
      this.lastTapAt = now;
      this.maybeFinalize();
      return;
    }
    this.downAt.set(ke.code, performance.now());
  };

  private readonly handleKeyUp = (e: Event): void => {
    if (!this.active) return;
    const ke = e as KeyboardEvent;
    if (ke.repeat || ke.key === 'Unidentified') return;
    const down = this.downAt.get(ke.code);
    if (down !== undefined) {
      this.dwellTimes.push(performance.now() - down);
      this.downAt.delete(ke.code);
    }
  };

  private readonly handleInput = (): void => {
    if (!this.active || this.tapMode) return;
    const now = performance.now();
    if (this.lastInputAt > 0) {
      this.flightTimes.push(now - this.lastInputAt);
    }
    this.lastInputAt = now;
    this.maybeFinalize();
  };

  private maybeFinalize(): void {
    if (this.flightTimes.length >= this.sampleSize) {
      this.active = false;
      this.onReport(this.buildReport());
    }
  }

  private buildReport(): HTLEntropyReport {
    const meanFlight = this.mean(this.flightTimes);
    const stdDevFlight = this.stdDev(this.flightTimes, meanFlight);
    const shannonEntropy = this.entropy(this.flightTimes, 25);
    const meanDwell = this.dwellTimes.length > 0 ? this.mean(this.dwellTimes) : 0;
    return {
      sampleCount: this.flightTimes.length,
      meanFlight,
      stdDevFlight,
      shannonEntropy,
      meanDwell,
      dwellSampleCount: this.dwellTimes.length,
      captureMode: this.tapMode ? 'tap' : 'input',
      isHumanLikely: stdDevFlight > 18 && shannonEntropy > 2.5,
      capturedAt: Date.now(),
    };
  }

  private mean(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  private stdDev(values: number[], meanValue: number): number {
    const variance = values.reduce((acc, v) => acc + (v - meanValue) ** 2, 0) / values.length;
    return Math.sqrt(variance);
  }

  private entropy(values: number[], binSize: number): number {
    const bins = new Map<number, number>();
    for (const v of values) {
      const bin = Math.floor(v / binSize);
      bins.set(bin, (bins.get(bin) ?? 0) + 1);
    }
    let h = 0;
    for (const count of bins.values()) {
      const p = count / values.length;
      h -= p * Math.log2(p);
    }
    return h;
  }

  public destroy(): void {
    this.active = false;
    this.target.removeEventListener('input', this.handleInput);
    this.target.removeEventListener('keydown', this.handleKeyDown);
    this.target.removeEventListener('keyup', this.handleKeyUp);
  }
}
