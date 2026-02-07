import { it, expect, describe } from 'vitest';

import {
	getAllTemplates,
	getTemplateById,
	filterTemplates,
	PERIODIZATION_TEMPLATES
} from './periodization';

// ============ getAllTemplates ============

describe('getAllTemplates', () => {
	it('returns all templates as list items', () => {
		const result = getAllTemplates();
		expect(result.length).toBe(PERIODIZATION_TEMPLATES.length);
		expect(result.length).toBeGreaterThanOrEqual(3);
	});

	it('returns summary fields only (no full details)', () => {
		const result = getAllTemplates();
		for (const item of result) {
			expect(item).toHaveProperty('id');
			expect(item).toHaveProperty('name');
			expect(item).toHaveProperty('description');
			expect(item).toHaveProperty('split');
			expect(item).toHaveProperty('daysPerWeek');
			expect(item).toHaveProperty('targetLevel');
			expect(item).toHaveProperty('tags');
			// Should NOT have full details
			expect(item).not.toHaveProperty('weeklySchedule');
			expect(item).not.toHaveProperty('blocks');
			expect(item).not.toHaveProperty('volumeRecommendations');
			expect(item).not.toHaveProperty('progressionScheme');
		}
	});
});

// ============ getTemplateById ============

describe('getTemplateById', () => {
	it('returns full template for valid ID', () => {
		const result = getTemplateById('full_body_3day_beginner');
		expect(result).not.toBeNull();
		expect(result!.id).toBe('full_body_3day_beginner');
		expect(result).toHaveProperty('weeklySchedule');
		expect(result).toHaveProperty('blocks');
		expect(result).toHaveProperty('volumeRecommendations');
		expect(result).toHaveProperty('progressionScheme');
	});

	it('returns null for non-existent ID', () => {
		expect(getTemplateById('nonexistent')).toBeNull();
	});

	it('returns template with correct structure', () => {
		const result = getTemplateById('ppl_6day_hypertrophy');
		expect(result).not.toBeNull();
		expect(result!.split).toBe('push_pull_legs');
		expect(result!.daysPerWeek).toBe(6);
		expect(result!.weeklySchedule.length).toBe(6);
		expect(result!.blocks.length).toBeGreaterThan(0);
		expect(result!.volumeRecommendations.length).toBeGreaterThan(0);
	});

	it('upper/lower template has 4 days', () => {
		const result = getTemplateById('upper_lower_4day_intermediate');
		expect(result).not.toBeNull();
		expect(result!.daysPerWeek).toBe(4);
		expect(result!.weeklySchedule.length).toBe(4);
	});
});

// ============ filterTemplates ============

describe('filterTemplates', () => {
	it('filters by split', () => {
		const result = filterTemplates({ split: 'full_body' });
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((t) => t.split === 'full_body')).toBe(true);
	});

	it('filters by daysPerWeek', () => {
		const result = filterTemplates({ daysPerWeek: 6 });
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((t) => t.daysPerWeek === 6)).toBe(true);
	});

	it('filters by targetLevel', () => {
		const result = filterTemplates({ targetLevel: 'beginner' });
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((t) => t.targetLevel === 'beginner')).toBe(true);
	});

	it('filters by tags', () => {
		const result = filterTemplates({ tags: ['hypertrophy'] });
		expect(result.length).toBeGreaterThan(0);
		expect(result.every((t) => t.tags.includes('hypertrophy'))).toBe(true);
	});

	it('combines multiple filters', () => {
		const result = filterTemplates({ daysPerWeek: 6, targetLevel: 'intermediate' });
		expect(result.every((t) => t.daysPerWeek === 6 && t.targetLevel === 'intermediate')).toBe(true);
	});

	it('returns empty array when no matches', () => {
		const result = filterTemplates({ daysPerWeek: 7 });
		expect(result).toEqual([]);
	});

	it('returns list items, not full templates', () => {
		const result = filterTemplates({ split: 'push_pull_legs' });
		for (const item of result) {
			expect(item).not.toHaveProperty('weeklySchedule');
			expect(item).not.toHaveProperty('blocks');
		}
	});
});

// ============ Template Data Integrity ============

describe('template data integrity', () => {
	it('all templates have unique IDs', () => {
		const ids = PERIODIZATION_TEMPLATES.map((t) => t.id);
		expect(new Set(ids).size).toBe(ids.length);
	});

	it('all templates have volume recommendations', () => {
		for (const t of PERIODIZATION_TEMPLATES) {
			expect(t.volumeRecommendations.length).toBeGreaterThan(0);
		}
	});

	it('all templates have at least one block', () => {
		for (const t of PERIODIZATION_TEMPLATES) {
			expect(t.blocks.length).toBeGreaterThan(0);
		}
	});

	it('weeklySchedule length matches daysPerWeek', () => {
		for (const t of PERIODIZATION_TEMPLATES) {
			expect(t.weeklySchedule.length).toBe(t.daysPerWeek);
		}
	});

	it('all templates include a deload block', () => {
		for (const t of PERIODIZATION_TEMPLATES) {
			expect(t.blocks.some((b) => b.type === 'deload')).toBe(true);
		}
	});

	it('volume recommendations have valid ranges', () => {
		for (const t of PERIODIZATION_TEMPLATES) {
			for (const v of t.volumeRecommendations) {
				expect(v.setsPerWeek.min).toBeLessThanOrEqual(v.setsPerWeek.max);
				expect(v.setsPerWeek.min).toBeGreaterThanOrEqual(0);
				expect(v.sessionsPerWeek).toBeGreaterThan(0);
			}
		}
	});
});
