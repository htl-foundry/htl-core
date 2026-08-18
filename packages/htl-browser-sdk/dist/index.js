export class HTLKeystrokeTracker {
    constructor(target, sampleSize, onReport) {
        this.flightTimes = [];
        this.dwellTimes = [];
        this.lastInputAt = 0;
        this.lastTapAt = 0;
        this.tapMode = false;
        this.downAt = new Map();
        this.active = true;
        this.handleKeyDown = (e) => {
            if (!this.active)
                return;
            const ke = e;
            if (ke.repeat)
                return;
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
        this.handleKeyUp = (e) => {
            if (!this.active)
                return;
            const ke = e;
            if (ke.repeat || ke.key === 'Unidentified')
                return;
            const down = this.downAt.get(ke.code);
            if (down !== undefined) {
                this.dwellTimes.push(performance.now() - down);
                this.downAt.delete(ke.code);
            }
        };
        this.handleInput = () => {
            if (!this.active || this.tapMode)
                return;
            const now = performance.now();
            if (this.lastInputAt > 0) {
                this.flightTimes.push(now - this.lastInputAt);
            }
            this.lastInputAt = now;
            this.maybeFinalize();
        };
        this.target = target;
        this.sampleSize = sampleSize;
        this.onReport = onReport;
        this.target.addEventListener('input', this.handleInput);
        this.target.addEventListener('keydown', this.handleKeyDown);
        this.target.addEventListener('keyup', this.handleKeyUp);
    }
    get capturedCount() {
        return this.flightTimes.length;
    }
    maybeFinalize() {
        if (this.flightTimes.length >= this.sampleSize) {
            this.active = false;
            this.onReport(this.buildReport());
        }
    }
    buildReport() {
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
    mean(values) {
        return values.reduce((a, b) => a + b, 0) / values.length;
    }
    stdDev(values, meanValue) {
        const variance = values.reduce((acc, v) => acc + (v - meanValue) ** 2, 0) / values.length;
        return Math.sqrt(variance);
    }
    entropy(values, binSize) {
        const bins = new Map();
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
    destroy() {
        this.active = false;
        this.target.removeEventListener('input', this.handleInput);
        this.target.removeEventListener('keydown', this.handleKeyDown);
        this.target.removeEventListener('keyup', this.handleKeyUp);
    }
}
