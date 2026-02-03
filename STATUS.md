# Logmaxing Status

> Last updated: 2026-02-02

## Current Phase: 1 - API Foundation (60% complete)

### Done

- [x] PostgreSQL database (Supabase)
- [x] Exercise database (176 exercises with EMG data, muscle activation %)
- [x] Muscle groups (19 muscles with MEV/MAV/MRV thresholds)
- [x] Equipment database (89 items)
- [x] REST API endpoints (muscles, exercises, equipment)
- [x] Rate limiting middleware
- [x] OpenAPI 3.1 documentation at /docs
- [x] Valibot validation on POST endpoints

### Next Up (Priority Order)

| #   | Item                              | Why                                             | Size |
| --- | --------------------------------- | ----------------------------------------------- | ---- |
| 1   | **Volume Calculation Engine**     | Core differentiator - "No competitor does this" | L    |
| 2   | Input validation on PUT endpoints | Security requirement                            | S    |
| 3   | API Key System                    | Enables revenue validation gates                | M    |
| 4   | Testing infrastructure (Vitest)   | Volume engine needs tests                       | M    |

### Blocking Nothing

Data foundation is complete. Volume engine can start immediately.

---

## Volume Engine Spec (Next Task)

**Input**: Array of sets `{ exercise_id, reps, weight, rpe }`

**Output**: Volume per muscle with status

```
GET /api/volume
→ { muscles: [{ name: "chest", sets: 12, status: "optimal" }] }

POST /api/volume (planned)
→ Volume + recommendations
```

**Logic**:

1. Look up exercise → muscle mappings (exerciseMuscle table)
2. Weight sets by activation % (1 set × 0.7 activation = 0.7 volume)
3. Sum weekly volume per muscle
4. Compare to MEV/MAV/MRV thresholds
5. Return status: "under" | "optimal" | "over"

**Files created**:

- `src/lib/server/api/volume.ts` - Core calculation ✅
- `src/routes/api/volume/+server.ts` - REST endpoint ✅
- `src/routes/api/volume/analyze/+server.ts` - Analysis endpoint (planned)

---

## Validation Gates

| Gate                 | Target | Status                |
| -------------------- | ------ | --------------------- |
| API free signups     | 10     | Blocked (no API keys) |
| API paid conversions | 3      | Blocked (no API keys) |
| Waitlist signups     | 300    | Not started           |

---

## Quick Reference

| Doc                                | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| [PROJECT_PLAN.md](PROJECT_PLAN.md) | Vision, roadmap, business goals         |
| [CLAUDE.md](CLAUDE.md)             | Code patterns, commands, architecture   |
| [docs/changelog/](docs/changelog/) | Implementation logs                     |
| [docs/decisions/](docs/decisions/) | Architecture decisions                  |
| [docs/archive/](docs/archive/)     | Detailed planning docs (reference only) |
