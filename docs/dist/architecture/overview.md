---
name: architecture-overview
description: "Overview of the Enterprise Edge Security Hub architecture."
metadata:
  tags: "security,edge,architecture,enterprise"
  version: "1.0.0"
---

# Enterprise Edge Security Hub - Architecture Overview

## Objective
The Enterprise Edge Security Hub provides real-time threat detection and mitigation at the network edge, optimized for Indian mid-market businesses.

## Tech Stack
- **Frontend**: Next.js 16 (App Router), Tailwind CSS, Framer Motion, Lucide React
- **Edge Runtime**: Vercel Edge Runtime / Cloudflare Workers
- **Database**: Edge-compatible key-value or relational (Supabase/Neon/Cloudflare D1)
- **Security Engine**: Custom WAF ruleset with AI-driven anomaly detection

## Core Components
1. **Edge Node Network**: Geographically distributed nodes to intercept traffic with <20ms latency.
2. **Threat Mitigation Layer**: Real-time filtering of SQLi, XSS, and Brute Force attacks.
3. **Analytics Pipeline**: Aggregated log stream from nodes to a central dashboard.
4. **Anomaly Engine**: Statistical model to detect zero-day traffic spikes.

## Pricing Strategy (from Indian Avengers Research Lab)
- **Base Tier**: Free for startups (up to 5 employees)
- **Pro Tier**: $49/mo (up to 50 employees) - Premium edge priority
- **Enterprise**: $499/mo (Unlimited) - Custom WAF rules and dedicated nodes

## Status
- **Phase 1**: Core Dashboard UI (COMPLETED)
- **Phase 2**: Real-time Log Stream (PENDING)
- **Phase 3**: Edge Mitigation Logic (PENDING)
