/**
 * Category lookup helpers for the static game catalog.
 *
 * These helpers accept an injectable Drizzle database instance so they can be
 * used in both page builds and unit tests without depending on the Astro runtime.
 */

import { asc } from 'drizzle-orm';
import type { Database } from './db';
import { categories } from '../../db/schema';
import type { Category } from '../types/game';

/** Return every category sorted alphabetically by name. */
export async function getAllCategories(db: Database): Promise<Category[]> {
    const rows = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .orderBy(asc(categories.name));

    return rows;
}
