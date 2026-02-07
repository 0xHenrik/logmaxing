# Logmaxing Status

> Last updated: 2026-02-04

## Next Session Quick Start

```bash
pnpm dev                    # Start server
pnpm seed:api-keys          # Get test API keys
```

**Where we left off:** Tier 1 complete (filters working). Next: Update OpenAPI docs, then Tier 2/3.

**Test the API:**

```bash
curl -H "X-API-Key: <key>" "http://localhost:5173/api/exercises?difficulty=beginner&forceProfile=descending"
```

---

## Current Phase: 2 - Make It Sellable

Phase 1 (API Foundation) is **complete**. Now focused on making the API worth paying for.

### Phase 1 Completed

- [x] PostgreSQL database (Supabase)
- [x] Exercise database (176 exercises with EMG data, muscle activation %)
- [x] Muscle groups (19 muscles with MEV/MAV/MRV thresholds + recovery data)
- [x] Equipment database (89 items)
- [x] REST API endpoints (muscles, exercises, equipment, volume)
- [x] Rate limiting middleware (tier-based)
- [x] OpenAPI 3.1 documentation at /docs
- [x] Valibot validation on all endpoints
- [x] **Volume Calculation Engine** (core differentiator)
- [x] **API Key System** (create, validate, revoke, tier-based rate limits)
- [x] **Biomechanics Schema** (difficulty, movementPattern, forceProfile, stretchPosition, etc.)
- [x] Testing infrastructure (Vitest)

---

## Next Steps (Priority Order)

### Tier 1: Quick Wins (Make API Usable) - COMPLETE ✅

| #   | Task                                | Status                      |
| --- | ----------------------------------- | --------------------------- |
| 1   | Push schema + seed data to DB       | ✅ Done                     |
| 2   | Add filter params to `/exercises`   | ✅ Done                     |
| 3   | Enrich exercises with biomechanics  | ✅ Done (all 176 exercises) |
| 4   | Update OpenAPI docs with new fields | ⏳ Pending                  |

**Available filter params:**

- `difficulty` (beginner/intermediate/advanced)
- `movementPattern` (horizontal_push, hip_hinge, squat, etc.)
- `forceProfile` (ascending/descending/bell/constant)
- `stretchPosition` (lengthened/mid/shortened)
- `unilateral` (true/false)
- `gripType` (overhand/underhand/neutral/mixed/none)

### Tier 2: Nice to Have (Differentiate)

| #   | Task                             | Skill                   | Why                | Size |
| --- | -------------------------------- | ----------------------- | ------------------ | ---- |
| 1   | Add alternatives mapping         | `/schema`, `/seed-data` | High value feature | M    |
| 2   | Periodization templates endpoint | `/api-route`            | Differentiator     | M    |
| 3   | Add tests for API key validation | manual                  | Reliability        | S    |

### Tier 3: Polish (Revenue Ready)

| #   | Task                      | Skill           | Why             | Size |
| --- | ------------------------- | --------------- | --------------- | ---- |
| 1   | Interactive docs (Scalar) | manual          | Developer trust | M    |
| 2   | Landing page              | `/landing-page` | Conversion      | M    |
| 3   | Pricing page              | `/component`    | Conversion      | S    |
| 4   | Stripe integration        | `/auth`, manual | Revenue         | L    |
| 5   | API key dashboard         | `/component`    | Self-service    | M    |

---

## Architecture Note

SvelteKit handles everything in one project:

| Route        | Purpose            |
| ------------ | ------------------ |
| `/`          | Landing page       |
| `/docs`      | API documentation  |
| `/pricing`   | Stripe checkout    |
| `/dashboard` | API key management |
| `/api/*`     | The actual API     |

---

## Volume Engine (Complete)

**Endpoint**: `POST /api/volume`

**Input**: Exercise-based or direct muscle input

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
| Tier | Requests/Day |
| ---------- | ------------ |
| free | 100 |
| developer | 170 |
| pro | 850 |
| enterprise | 3400 |

**Header**: `X-API-Key: lmx_...`

---

## Validation Gates

| Gate                 | Target | Status                |
| -------------------- | ------ | --------------------- |
| API free signups     | 10     | Ready (API keys work) |
| API paid conversions | 3      | Blocked (no Stripe)   |
| Waitlist signups     | 300    | Blocked (no landing)  |

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

| File                                  | Purpose                                       |
| ------------------------------------- | --------------------------------------------- |
| `src/lib/server/api/exercises.ts`     | Exercise CRUD + filtering logic               |
| `src/routes/api/exercises/+server.ts` | Exercise REST endpoint                        |
| `src/lib/server/api/apiKeys.ts`       | API key generation/validation                 |
| `src/hooks.server.ts`                 | Auth middleware                               |
| `seed-data.ts`                        | All seed data (exercises, muscles, equipment) |
