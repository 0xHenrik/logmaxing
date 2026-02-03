// seed-api-keys.ts - Generate test API keys for development
import { createHash, randomBytes } from 'crypto';

import postgres from 'postgres';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';

import { apiKey, userProfile } from './src/lib/server/db/schema';

import 'dotenv/config';

const connectionString = process.env.DATABASE_URL!;

if (!connectionString) {
	console.error('DATABASE_URL environment variable is not set');
	process.exit(1);
}

const client = postgres(connectionString, { prepare: false });
const db = drizzle(client);

// Key generation functions (same as in apiKeys.ts)
function generateRawKey(): string {
	const randomPart = randomBytes(32).toString('base64url').slice(0, 43);
	return `lmx_${randomPart}`;
}

function hashKey(rawKey: string): string {
	return createHash('sha256').update(rawKey).digest('hex');
}

function extractPrefix(rawKey: string): string {
	return rawKey.slice(0, 16);
}

type ApiKeyTier = 'free' | 'developer' | 'pro' | 'enterprise';

async function seedApiKeys() {
	console.log('🔑 Starting API key seed...\n');

	try {
		// First, ensure we have a test user
		console.log('Checking for test user...');
		let [testUser] = await db.select().from(userProfile).where(eq(userProfile.name, 'Test User'));

		if (!testUser) {
			console.log('Creating test user...');
			[testUser] = await db
				.insert(userProfile)
				.values({
					name: 'Test User',
					fitnessLevel: 2,
					age: 30,
					sex: 'male'
				})
				.returning();
			console.log(`  ✓ Created test user with ID: ${testUser.id}`);
		} else {
			console.log(`  ✓ Found existing test user with ID: ${testUser.id}`);
		}

		// Clear existing API keys for this user (optional - for clean slate)
		console.log('\nClearing existing API keys for test user...');
		await db.delete(apiKey).where(eq(apiKey.userId, testUser.id));
		console.log('  ✓ Cleared existing keys');

		// Create test keys for each tier
		const tiers: ApiKeyTier[] = ['free', 'developer', 'pro', 'enterprise'];
		const createdKeys: { tier: string; rawKey: string; prefix: string }[] = [];

		console.log('\nCreating API keys...');

		for (const tier of tiers) {
			const rawKey = generateRawKey();
			const keyHash = hashKey(rawKey);
			const keyPrefix = extractPrefix(rawKey);

			await db.insert(apiKey).values({
				userId: testUser.id,
				name: `Test ${tier.charAt(0).toUpperCase() + tier.slice(1)} Key`,
				tier,
				keyPrefix,
				keyHash
			});

			createdKeys.push({ tier, rawKey, prefix: keyPrefix });
			console.log(`  ✓ Created ${tier} tier key`);
		}

		console.log('\n' + '='.repeat(80));
		console.log('🎉 API KEY SEED COMPLETED!');
		console.log('='.repeat(80));
		console.log('\n⚠️  IMPORTANT: Save these keys! They will NOT be shown again.\n');

		for (const key of createdKeys) {
			console.log(`📋 ${key.tier.toUpperCase()} TIER:`);
			console.log(`   ${key.rawKey}`);
			console.log('');
		}

		console.log('='.repeat(80));
		console.log('\n📝 Usage example:');
		console.log('   curl -H "X-API-Key: <key>" http://localhost:5173/api/muscles\n');

		console.log('📊 Rate limits by tier:');
		console.log('   - free:       100 requests/day');
		console.log('   - developer:  170 requests/day');
		console.log('   - pro:        850 requests/day');
		console.log('   - enterprise: 3,400 requests/day\n');
	} catch (error) {
		console.error('❌ Seed failed:', error);
		throw error;
	} finally {
		await client.end();
	}
}

seedApiKeys().catch((err) => {
	console.error('❌ API key seed failed:', err);
	process.exit(1);
});
