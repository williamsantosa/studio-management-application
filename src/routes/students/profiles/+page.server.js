import { getStudents } from "$lib/pocketbase";

export async function load() {
    return {
        students: await getStudents()
    }
}