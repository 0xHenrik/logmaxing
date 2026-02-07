# Logmaxing Status

> Last updated: 2026-02-07

## Next Session Quick Start

```bash
pnpm dev                    # Start server
pnpm seed:api-keys          # Get test API keys
```

**Where we left off:** Phase 1 complete. Security hardening done. OpenAPI docs fully updated (v1.1.0). Next: Tier 2 features or revenue pipeline.

**Test the API:**

```bash
curl -H "X-API-Key: <key>" "https://api.logmaxing.tech/exercises?difficulty=beginner&forceProfile=descending"
```

---

## Current Phase: 2 - Make It Sellable

Phase 1 (API Foundation) is **complete**. Security is hardened. Docs are comprehensive.

### Phase 1 Completed

- [x] PostgreSQL database (Supabase)
- [x] Exercise database (176 exercises with EMG data, muscle activation %)
- [x] Muscle groups (19 muscles with MEV/MAV/MRV thresholds + recovery data)
- [x] Equipment database (89 items)
- [x] REST API endpoints (muscles, exercises, equipment, volume, keys, waitlist)
- [x] Rate limiting middleware (tier-based with Redis, IP-based auth protection)
- [x] OpenAPI 3.1 documentation at /docs (v1.1.0 — all endpoints documented)
- [x] Valibot validation on all endpoints
- [x] **Volume Calculation Engine** (core differentiator)
- [x] **API Key System** (create, validate, revoke, tier-based rate limits)
- [x] **Biomechanics Schema** (difficulty, movementPattern, forceProfile, stretchPosition, etc.)
- [x] Testing infrastructure (Vitest — volume engine covered)
- [x] **Landing page** with SEO, JSON-LD, pricing tiers, waitlist
- [x] **Interactive docs** (Scalar embedded at /docs)
- [x] **Waitlist endpoint** (IP rate-limited, anti-enumeration)
- [x] **API subdomain** (api.logmaxing.tech via Vercel rewrites)
- [x] **Security hardening** (brute-force protection, input validation, LIKE injection prevention, Content-Type enforcement, pagination clamping)
- [x] **Security headers** (HSTS, CSP, X-Frame-Options, Permissions-Policy)

---

## What's Done vs What's Needed

### Done

| Feature                                         | Status   |
| ----------------------------------------------- | -------- |
| Exercise CRUD (read) + filtering (9 params)     | Complete |
| Muscle CRUD (full, enterprise-gated writes)     | Complete |
| Equipment listing                               | Complete |
| Volume calculator (EMG-weighted)                | Complete |
| API key management (create/list/revoke/delete)  | Complete |
| Waitlist                                        | Complete |
| OpenAPI docs (all endpoints + error responses)  | Complete |
| Landing page + SEO                              | Complete |
| Scalar interactive docs                         | Complete |
| Rate limiting (6 tiers including auth + public) | Complete |
| Security headers + input validation             | Complete |
| API subdomain routing                           | Complete |

### Not Built Yet (schema exists, no routes)

| Feature                    | Schema Tables            | Notes                                |
| -------------------------- | ------------------------ | ------------------------------------ |
| Programs                   | program, block, blockDay | Full workout program builder         |
| Workouts                   | workout, workoutExercise | Exercise assignments within programs |
| Workout logging            | workoutLog               | Performance tracking                 |
| User check-ins             | userCheckin              | Body metrics tracking                |
| User profiles              | userProfile              | Fitness level, demographics          |
| User auth (login/register) | —                        | auth.remote.ts is empty              |

---

## Next Steps (Priority Order)

### Tier 2: Differentiate

| #   | Task                                    | Why                                             | Size |
| --- | --------------------------------------- | ----------------------------------------------- | ---- |
| 1   | Exercise alternatives mapping           | High value — "what can I swap bench press for?" | M    |
| 2   | Periodization templates endpoint        | Differentiator for program builders             | M    |
| 3   | Tests for API key validation + security | Only volume has tests currently                 | S    |

### Tier 3: Revenue Pipeline

| #   | Task                           | Why                                                     | Size |
| --- | ------------------------------ | ------------------------------------------------------- | ---- |
| 1   | Pricing page                   | Conversion — pricing is on landing page but no checkout | M    |
| 2   | Stripe integration             | Actual revenue                                          | L    |
| 3   | API key dashboard (web UI)     | Self-service key management                             | M    |
| 4   | User auth (registration/login) | Required for dashboard + Stripe                         | L    |

### Tier 4: Platform Growth

| #   | Task                          | Why                               | Size |
| --- | ----------------------------- | --------------------------------- | ---- |
| 1   | Program builder API (CRUD)    | Unlocks workout tracking use case | L    |
| 2   | Workout logging API           | Core mobile app feature           | L    |
| 3   | Progress tracking / check-ins | Retention feature                 | M    |

---

## Architecture Note

SvelteKit handles everything in one project:

| Route                | Purpose                  | Status    |
| -------------------- | ------------------------ | --------- |
| `/`                  | Landing page             | Live      |
| `/docs`              | Scalar API documentation | Live      |
| `/api/*`             | REST API                 | Live      |
| `api.logmaxing.tech` | API subdomain            | Live      |
| `/pricing`           | Stripe checkout          | Not built |
| `/dashboard`         | API key management UI    | Not built |

---

## Volume Engine (Complete)

**Endpoint**: `POST /api/volume`

**Input**: Exercise-based or direct muscle input (or both combined)

```json
{
	"exercises": [{ "exerciseId": 1, "sets": 4 }],
	"directVolume": [{ "muscleId": 1, "sets": 6 }]
}
```

**Output**: Volume per muscle with zone status

```json
{
  "muscles": [{ "muscleId": 1, "muscleName": "Chest", "effectiveSets": 8, "zone": "under", "thresholds": {...} }],
  "summary": { "totalMuscles": 1, "under": ["Chest"], "optimal": [], "over": [] }
}
```

---

## API Key System (Complete)

**Endpoints**:

- `GET /api/keys` - List user's keys
- `POST /api/keys` - Create key (returns raw key once)
- `GET /api/keys/:id` - Key details
- `DELETE /api/keys/:id` - Permanent delete
- `POST /api/keys/:id/revoke` - Soft delete

**Tiers & Rate Limits**:
| Tier | Requests/Day | Max Keys |
| ---------- | ------------ | -------- |
| free | 100 | 5 |
| developer | 170 | 10 |
| pro | 850 | 25 |
| enterprise | 3400 | 100 |

**Additional Rate Limits**:
| Type | Limit | Purpose |
|------|-------|---------|
| auth_attempt | 20/15min per IP | Brute-force protection |
| public | 10/day per IP | Waitlist endpoint |

**Header**: `X-API-Key: lmx_...`

---

## Validation Gates

| Gate                 | Target | Status                |
| -------------------- | ------ | --------------------- |
| API free signups     | 10     | Ready (API keys work) |
| API paid conversions | 3      | Blocked (no Stripe)   |
| Waitlist signups     | 300    | Ready (endpoint live) |

---

## Quick Reference

| Doc                                | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Vision, roadmap, business goals         |
| [CLAUDE.md](CLAUDE.md)             | Code patterns, commands, architecture   |
| [docs/changelog/](docs/changelog/) | Implementation logs                     |
| [docs/decisions/](docs/decisions/) | Architecture decisions                  |
| [docs/archive/](docs/archive/)     | Detailed planning docs (reference only) |

## Key Files

| File                                  | Purpose                                              |
| ------------------------------------- | ---------------------------------------------------- |
| `src/lib/server/api/openapi.ts`       | OpenAPI 3.1 specification (v1.1.0)                   |
| `src/lib/server/api/exercises.ts`     | Exercise CRUD + filtering logic                      |
| `src/routes/api/exercises/+server.ts` | Exercise REST endpoint                               |
| `src/lib/server/api/apiKeys.ts`       | API key generation/validation                        |
| `src/lib/server/api/validation.ts`    | Shared validation (parseId, escapeLike, requireJson) |
| `src/lib/server/ratelimit.ts`         | Rate limiting (6 tiers, Redis + memory fallback)     |
| `src/hooks.server.ts`                 | Auth middleware + security headers                   |
| `seed-data.ts`                        | All seed data (exercises, muscles, equipment)        |
