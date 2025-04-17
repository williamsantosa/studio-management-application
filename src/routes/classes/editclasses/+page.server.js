import { getClasses } from '$lib/pocketbase';

export async function load() {
	return {
		summaries: await getClasses()
	};
}