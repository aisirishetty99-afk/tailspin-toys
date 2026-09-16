/**
 * Publisher lookup helpers for the static game catalog.
 *
 * These helpers accept an injectable Drizzle database instance so they can be
 * used in both page builds and unit tests without depending on the Astro runtime.
 */

import { asc, eq } from 'drizzle-orm';
import type { Database } from './db';
import { publishers } from '../../db/schema';
import type { Publisher } from '../types/game';


type PublisherRow = {
    id: number;
    name: string;
};

function mapPublisher(row: PublisherRow): Publisher {
    return {
        id: row.id,
        name: row.name,
    };
}

/** Return every publisher sorted alphabetically by name. */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    const rows = await db
        .select({ id: publishers.id, name: publishers.name })
        .from(publishers)
        .orderBy(asc(publishers.name));

    return rows.map(mapPublisher);
}

/** Return a single publisher by id, or null when it does not exist. */
export async function getPublisherById(db: Database, id: number): Promise<Publisher | null> {
    const row = await db
        .select({ id: publishers.id, name: publishers.name })
        .from(publishers)
        .where(eq(publishers.id, id))
        .get();

    return row ? mapPublisher(row) : null;
}
