import { getInventory } from '$lib/pocketbase';

export async function load() {
    return {
        inventory: await getInventory()
    };
}