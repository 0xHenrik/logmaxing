import type { RequestHandler } from '@sveltejs/kit';

import { env } from '$env/dynamic/private';

import { getStripe } from '$lib/server/stripe';
import {
	handleCheckoutCompleted,
	handleSubscriptionUpdated,
	handleSubscriptionDeleted
} from '$lib/server/api/subscriptions';

export const POST: RequestHandler = async ({ request }) => {
	const signature = request.headers.get('stripe-signature');
	if (!signature) {
		return Response.json({ error: 'Missing stripe-signature header' }, { status: 400 });
	}

	if (!env.STRIPE_WEBHOOK_SECRET) {
		console.error('STRIPE_WEBHOOK_SECRET is not configured');
		return Response.json({ error: 'Webhook not configured' }, { status: 500 });
	}

	const stripe = getStripe();
	const body = await request.text();

	let event;
	try {
		event = stripe.webhooks.constructEvent(body, signature, env.STRIPE_WEBHOOK_SECRET);
	} catch (err) {
		const message = err instanceof Error ? err.message : 'Unknown error';
		console.error('Webhook signature verification failed:', message);
		return Response.json({ error: 'Invalid signature' }, { status: 400 });
	}

	try {
		switch (event.type) {
			case 'checkout.session.completed': {
				const session = event.data.object;
				await handleCheckoutCompleted(session.id);
				break;
			}
			case 'customer.subscription.updated': {
				const subscription = event.data.object;
				await handleSubscriptionUpdated(subscription.id);
				break;
			}
			case 'customer.subscription.deleted': {
				const subscription = event.data.object;
				await handleSubscriptionDeleted(subscription.id);
				break;
			}
			default:
				break;
		}

		return Response.json({ received: true });
	} catch (error) {
		console.error('Webhook handler error:', error);
		return Response.json({ error: 'Webhook handler failed' }, { status: 500 });
	}
};
