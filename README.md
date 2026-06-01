# LeadIntel Landing Page

One-shot lead research product. User uploads CSV, selects lead count, pays via Stripe, receives AI-researched Excel report via email.

No accounts, no dashboards, no history. Every visit is a fresh transaction.

---

## Cost Breakdown Per Lead

### API Rates (from pricing pages, 2026-05-25)

| Service | Rate | Source |
|---------|------|--------|
| **Serper.dev** | $0.001/query (credit pack: $50 for 50K queries, valid 6 months) | https://serper.dev/ |
| **Jina Reader** | ~$0.02/1M tokens (free 10M tokens per API key) | https://jina.ai/reader/ |
| **OpenAI (gpt-4.1-mini)** | $0.40/1M input, $1.60/1M output | https://openai.com/api/pricing/ |
| **Apify** | Pay-per-result actors. Starter plan: $29/mo | https://apify.com/pricing |
| **Resend** | Free: 100 emails/day, 3K/month. Pro: $20/mo for 50K | https://resend.com/pricing |
| **GCP Cloud Run** | $0.000024/vCPU-sec. Free tier: 180K vCPU-sec/mo | https://cloud.google.com/run/pricing |

### Actual Cost Per Lead (measured from 3-lead test run dashboards)

| Service | Measured usage per lead | Calculation | Cost per lead |
|---------|------------------------|-------------|---------------|
| **Serper** | 3 queries, 1 credit each (from Serper activity logs) | 3 × $0.001 | **$0.003** |
| **Jina Reader** | 5 requests, 12,583 tokens (37,749 tokens / 3 leads, May 22 15:00) | 12,583 × $0.02 / 1M | **$0.00025** |
| **OpenAI** | ~32K input + ~800 output tokens (97,319 input tokens / 3 leads, May 19 bar) | 32K × $0.40/1M + 800 × $1.60/1M | **$0.014** |
| **Apify Profile** | 1 profile scrape ($0.03 for 3 leads, May 19) | $0.03 / 3 | **$0.010** |
| **Apify Posts** | 1 posts scrape ($0.08 for 3 leads, May 19) | $0.08 / 3 | **$0.027** |
| **Resend** | 1 email per order (not per lead) | Negligible | **~$0** |
| **Cloud Run** | Covered by free tier at current volume | Negligible | **~$0** |

### Total Cost Per Lead: $0.054

| Component | Cost/lead |
|-----------|-----------|
| Serper (3 queries) | $0.003 |
| Jina Reader (5 extractions) | $0.00025 |
| OpenAI synthesis (~32K input) | $0.014 |
| Apify LinkedIn profile | $0.010 |
| Apify LinkedIn posts | $0.027 |
| **Total** | **$0.054** |

### Cost Per Batch

| Batch size | Our cost |
|------------|----------|
| 25 leads | $1.35 |
| 50 leads | $2.70 |
| 100 leads | $5.40 |

---
