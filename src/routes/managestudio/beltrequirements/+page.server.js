import { getBeltRequirements } from "$lib/pocketbase";

export async function load() {
    return {
        beltRequirements: await getBeltRequirements()
    }
}