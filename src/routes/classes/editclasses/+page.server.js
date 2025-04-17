import { getClasses } from '$lib/pocketbase';

export async function load() {
	return {
		classes: await getClasses()
	};
}