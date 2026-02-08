import { eq } from 'drizzle-orm';

import { db } from '../db';
import { userProfile } from '../db/schema';
import { getStripe, getTierPriceMap, getPriceTierMap } from '../stripe';

export type SubscriptionTier = 'free' | 'developer' | 'pro' | 'enterprise';

/**
 * Create a Stripe Checkout Session for upgrading to a paid tier.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckoutSession(
	userId: number,
	tier: Exclude<SubscriptionTier, 'free'>,
	successUrl: string,
	cancelUrl: string
): Promise<string> {
	const stripe = getStripe();
	const priceMap = getTierPriceMap();

	const priceId = priceMap[tier];
	if (!priceId) throw new Error(`No Stripe price configured for tier: ${tier}`);

	const [user] = await db.select().from(userProfile).where(eq(userProfile.id, userId));
	if (!user) throw new Error('User not found');

	// Create or reuse Stripe customer
	let customerId = user.stripeCustomerId;
	if (!customerId) {
		const customer = await stripe.customers.create({
			email: user.email ?? undefined,
			metadata: { userId: String(userId) }
		});
		customerId = customer.id;
		await db
			.update(userProfile)
			.set({ stripeCustomerId: customerId })
			.where(eq(userProfile.id, userId));
	}

	const session = await stripe.checkout.sessions.create({
		customer: customerId,
		mode: 'subscription',
		line_items: [{ price: priceId, quantity: 1 }],
		success_url: successUrl,
		cancel_url: cancelUrl,
		metadata: { userId: String(userId), tier }
	});

	if (!session.url) throw new Error('Stripe did not return a checkout URL');
	return session.url;
}

/**
 * Create a Stripe Billing Portal session for managing an existing subscription.
 * Returns the portal URL to redirect the user to.
 */
export async function createBillingPortalSession(
	userId: number,
	returnUrl: string
): Promise<string> {
	const stripe = getStripe();

	const [user] = await db.select().from(userProfile).where(eq(userProfile.id, userId));
	if (!user?.stripeCustomerId) throw new Error('No Stripe customer found for this user');

	const session = await stripe.billingPortal.sessions.create({
		customer: user.stripeCustomerId,
		return_url: returnUrl
	});

	return session.url;
}

/**
 * Handle checkout.session.completed webhook event.
 * Links the Stripe subscription to the user profile.
 */
export async function handleCheckoutCompleted(sessionId: string): Promise<void> {
	const stripe = getStripe();
	const priceTierMap = getPriceTierMap();

	const session = await stripe.checkout.sessions.retrieve(sessionId);
	if (!session.customer || !session.subscription) return;

	const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
	const priceId = subscription.items.data[0]?.price.id ?? null;
	const tier = (priceId ? priceTierMap[priceId] : null) ?? 'free';

	await db
		.update(userProfile)
		.set({
			stripeSubscriptionId: subscription.id,
			stripePriceId: priceId,
			subscriptionTier: tier,
			subscriptionStatus: subscription.status,
			subscriptionCurrentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000)
		})
		.where(eq(userProfile.stripeCustomerId, session.customer as string));
}

/**
 * Handle customer.subscription.updated webhook event.
 * Updates tier, status, and period end.
 */
export async function handleSubscriptionUpdated(subscriptionId: string): Promise<void> {
	const stripe = getStripe();
	const priceTierMap = getPriceTierMap();

	const subscription = await stripe.subscriptions.retrieve(subscriptionId);
	const priceId = subscription.items.data[0]?.price.id ?? null;
	const tier = (priceId ? priceTierMap[priceId] : null) ?? 'free';

	await db
		.update(userProfile)
		.set({
			stripePriceId: priceId,
			subscriptionTier: tier,
			subscriptionStatus: subscription.status,
			subscriptionCurrentPeriodEnd: new Date(subscription.items.data[0]?.current_period_end * 1000)
		})
		.where(eq(userProfile.stripeSubscriptionId, subscription.id));
}

/**
 * Handle customer.subscription.deleted webhook event.
 * Resets user to free tier.
 */
export async function handleSubscriptionDeleted(subscriptionId: string): Promise<void> {
	await db
		.update(userProfile)
		.set({
			subscriptionTier: 'free',
			subscriptionStatus: 'canceled',
			stripePriceId: null,
			stripeSubscriptionId: null
		})
		.where(eq(userProfile.stripeSubscriptionId, subscriptionId));
}
