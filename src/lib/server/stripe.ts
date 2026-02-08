import Stripe from 'stripe';
import { env } from '$env/dynamic/private';
import { building } from '$app/environment';

let stripeClient: Stripe | null = null;

if (!building && env.STRIPE_SECRET_KEY) {
	stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
}

export function getStripe(): Stripe {
	if (!stripeClient) {
		if (!env.STRIPE_SECRET_KEY) {
			throw new Error('STRIPE_SECRET_KEY is not set');
		}
		stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
	}
	return stripeClient;
}

// Tier → Stripe Price ID mapping
export function getTierPriceMap(): Record<string, string> {
	return {
		developer: env.STRIPE_PRICE_DEVELOPER || '',
		pro: env.STRIPE_PRICE_PRO || '',
		enterprise: env.STRIPE_PRICE_ENTERPRISE || ''
	};
}

// Stripe Price ID → Tier mapping
export function getPriceTierMap(): Record<string, string> {
	const tierMap = getTierPriceMap();
	return Object.fromEntries(
		Object.entries(tierMap)
			.filter(([, priceId]) => priceId)
			.map(([tier, priceId]) => [priceId, tier])
	);
}
