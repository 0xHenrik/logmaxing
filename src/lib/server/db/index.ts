// db.ts - PostgreSQL connection for Supabase
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { DATABASE_URL } from '$env/static/private';

import * as schema from './schema';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(DATABASE_URL, { prepare: false });

export const db = drizzle(client, { schema });
