import { eq } from 'drizzle-orm';

import { db } from '../db';
import { type Waitlist, waitlist } from '../db/schema';

export async function addToWaitlist(email: string, source = 'landing_page'): Promise<Waitlist> {
	const [created] = await db.insert(waitlist).values({ email, source }).returning();
	return created;
}

export async function isOnWaitlist(email: string): Promise<boolean> {
	const [result] = await db.select().from(waitlist).where(eq(waitlist.email, email));
	return !!result;
}
