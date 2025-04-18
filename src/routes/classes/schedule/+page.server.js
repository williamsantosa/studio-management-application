import { getClassesStartingOn } from '$lib/pocketbase';

export async function load() {
    return {
        todayClasses: await getClassesStartingOn(new Date())
    };
}