# Logmaxing Status

> Last updated: 2026-02-03

## Current Phase: 1 - API Foundation (80% complete)

### Done

- [x] PostgreSQL database (Supabase)
- [x] Exercise database (176 exercises with EMG data, muscle activation %)
- [x] Muscle groups (19 muscles with MEV/MAV/MRV thresholds)
- [x] Equipment database (89 items)
- [x] REST API endpoints (muscles, exercises, equipment)
- [x] Rate limiting middleware
- [x] OpenAPI 3.1 documentation at /docs
- [x] Valibot validation on POST endpoints
- [x] **Volume Calculation Engine** (core differentiator)
- [x] Testing infrastructure (Vitest)

### Next Up (Priority Order)

| #   | Item                              | Why                              | Size |
| --- | --------------------------------- | -------------------------------- | ---- |
| 1   | Input validation on PUT endpoints | Security requirement             | S    |
| 2   | API Key System                    | Enables revenue validation gates | M    |

### Blocking Nothing

Volume engine complete. Ready for API key system.

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

**Files**:

- `src/lib/server/api/volume.ts` - Core calculation engine
- `src/routes/api/volume/+server.ts` - REST endpoint (GET for discovery, POST for calculation)
- `src/lib/server/api/volume.test.ts` - Unit tests

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
