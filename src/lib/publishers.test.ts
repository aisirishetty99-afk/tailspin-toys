import { beforeEach, describe, expect, it } from 'vitest';
import { publishers } from '../../db/schema';
import { createTestDatabase } from '../../db/test-helpers';
import type { Database } from './db';
import { getAllPublishers, getPublisherById } from './publishers';

describe('publishers data-access helpers', () => {
    let db: Database;

    beforeEach(async () => {
        db = await createTestDatabase();
        await db.insert(publishers).values([
            { name: 'Zenith Labs', description: 'Publisher A' },
            { name: 'Aster Games', description: 'Publisher B' },
        ]);
    });

    it('returns publishers ordered alphabetically by name', async () => {
        const publishersList = await getAllPublishers(db);

        expect(publishersList.map((publisher) => publisher.name)).toEqual([
            'Aster Games',
            'Zenith Labs',
        ]);
    });

    it('fetches a publisher by id', async () => {
        const [storedPublisher] = await db.select().from(publishers).orderBy(publishers.name);
        const publisher = await getPublisherById(db, storedPublisher.id);

        expect(publisher).toEqual({ id: storedPublisher.id, name: 'Aster Games' });
    });

    it('returns null when a publisher does not exist', async () => {
        await expect(getPublisherById(db, 99999)).resolves.toBeNull();
    });
});
