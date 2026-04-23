# EdgeShield - Enterprise Edge Security Hub

[![Indian Avengers](https://img.shields.io/badge/Managed%20By-Indian%20Avengers-orange?style=flat-square&logo=gitbook)](https://github.com/hansraj316/mission-control-openclaw)
[![Next.js](https://img.shields.io/badge/Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)

**EdgeShield** is a next-generation security platform built for Indian mid-market businesses. It delivers enterprise-grade cloud-native security integrated with edge computing to provide real-time threat detection and mitigation.

## Features
- **Global Edge Network**: Low-latency threat interception.
- **AI Anomaly Detection**: Proactive zero-day attack prevention.
- **Premium Dashboard**: Real-time visualization of security events.
- **India Pricing + ROI**: 3 INR pricing tiers and a monthly savings calculator.
- **Lead Capture CTA**: "Book Demo" submits to `/api/leads` with mailto fallback.

## India Pricing Strategy
The assessment flow is optimized for Indian enterprise buyers with transparent monthly pricing:
- **Starter SOC**: `₹69,999/month`
  - Managed WAF + bot defense
  - 24x7 SOC triage
  - Monthly risk reporting
- **Growth Shield**: `₹1,49,999/month`
  - DDoS and API protection
  - SIEM integrations
  - Priority response SLA
- **Enterprise Fortress**: `₹3,29,999/month`
  - Dedicated security architect
  - Compliance and audit support
  - Custom SLA

ROI model inputs (assessment page):
- Team size
- Current tooling cost per month (INR)
- Selected plan

Outputs:
- Estimated monthly savings
- Annualized savings and ROI percentage

## Getting Started
1. `npm install`
2. `npm run dev`

## Environment Variables
Create a `.env.local` file:

- `CONTACT_WEBHOOK_URL` (required for lead delivery)
- `LEAD_WEBHOOK_MAX_ATTEMPTS` (optional, default `3`)
- `LEAD_WEBHOOK_RETRY_BASE_MS` (optional, default `500`)
- `NEXT_PUBLIC_ASSESSMENT_BOOKING_URL` (optional, defaults to Calendly root)
- `NEXT_PUBLIC_SALES_EMAIL` (optional, used by safe mailto fallback, default `sales@example.com`)

## Usage Notes (Pricing + Demo CTA)
- Home page (`/`) includes a concise India pricing + ROI teaser with a `Book Demo` CTA.
- Assessment page (`/assessment`) contains:
  - Full INR pricing cards (3 plans)
  - Monthly ROI calculator (team size + current tooling cost)
  - Lead form that posts to `POST /api/leads`
  - Mailto fallback CTA if endpoint/webhook is unavailable

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
