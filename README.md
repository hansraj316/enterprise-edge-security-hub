# EdgeShield - Enterprise Edge Security Hub

[![Indian Avengers](https://img.shields.io/badge/Managed%20By-Indian%20Avengers-orange?style=flat-square&logo=gitbook)](https://github.com/hansraj316/mission-control-openclaw)
[![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)

**EdgeShield** is a next-generation security platform built for Indian mid-market businesses. It delivers enterprise-grade cloud-native security integrated with edge computing to provide real-time threat detection and mitigation.

## Features
- **Global Edge Network**: Low-latency threat interception.
- **AI Anomaly Detection**: Proactive zero-day attack prevention.
- **Premium Dashboard**: Real-time visualization of security events.
- **Cost Efficiency**: 67% price savings over traditional hardware-based solutions.

## Getting Started
1. `npm install`
2. `npm run dev`

## Environment Variables
Create a `.env.local` file:

- `CONTACT_WEBHOOK_URL` (required for lead delivery)
- `LEAD_WEBHOOK_MAX_ATTEMPTS` (optional, default `3`)
- `LEAD_WEBHOOK_RETRY_BASE_MS` (optional, default `500`)
- `NEXT_PUBLIC_ASSESSMENT_BOOKING_URL` (optional, defaults to Calendly root)

## Lead Payload Schema (`POST /api/leads`)
Required fields:
- `fullName`, `workEmail` (must be work domain), `company`, `role`
- `companySize`, `assessmentFocus`, `timeline`, `sourcePage`

Numeric inputs:
- `monthlyTrafficGb`, `annualSecuritySpendInr`, `estimatedIncidentsPerMonth`
- `estimatedAnnualSavingsInr`, `estimatedRoiPercent`

Anti-spam fields:
- `website` (honeypot, must be empty)
- `startedAt` (submission time trap)

Server-side wrapper sent to webhook:
- `type: "enterprise_assessment_lead"`
- `submittedAt`, `ip`, `userAgent`, `payload`

## Documentation
- [Architecture Overview](./docs/architecture/overview.md)
- [Security Strategy](./docs/security/strategy.md)
- [API Reference](./docs/api/endpoints.md)

## Team
- **Project Lead**: Master Hans
- **Principal Engineer**: Raj (Indian Avengers)
- **Research**: Anusandhan (Research Lab)


## Daily TPM delivery update (2026-04-22)
- Functional: Launch policy compliance dashboard with drift detection by edge cluster
- Non-functional: Implement signed release artifacts and SBOM export in CI pipeline
