# HumanTrust Layer (HTL)

**The trust layer for the post-AI internet.**

The internet is dead: most traffic is now synthetic. CAPTCHAs are obsolete,
KYC is a privacy disaster, and hardware oracles do not scale. HTL proves
*humanity* and *trust* mathematically - zero hardware, zero KYC, zero
personal data stored. Ever.

## The four pillars

1. **Self-Sovereign Identity (DID)** - you own your keys: `did:htl:<fp>`.
2. **Zero-Knowledge Proofs** - prove reliability, reveal nothing raw.
3. **Behavioral biometrics** - neuromuscular entropy (tap/keystroke
   dynamics) that AI cannot clone.
4. **HTIP** - a universal, portable trust score (0-1000).

## Why bots cannot pass

Bots inject regular delays: low Shannon entropy. Humans hesitate,
accelerate, tire: high entropy. HTL measures the physics of your nervous
system, locally. Only derived metrics leave the device.

## Architecture

- `packages/htl-browser-sdk` - entropy engine (TypeScript, zero deps).
- `packages/htl-zk-circuits` - ZK-SNARK circuits (Circom) - hardening.
- `packages/htl-rust-core` - DID / Ed25519 sovereign core - hardening.
- `apps/htl-test` - live verification zones (v0.2 word mode, v0.3 tap mode).

## Genesis status

Stealth forge phase. IDENTITE-001 forged on a 2019 Android tablet:
HTIP 955/1000, Ed25519, Shannon entropy 4.70 bits. Budget so far: 0 EUR.

MIT License.
