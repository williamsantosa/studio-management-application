import { getStudents, getClassesStartingOn, formatDateToMMDDYYYY } from '$lib/pocketbase';

export async function load() {
    return {
        todayClasses: await getClassesStartingOn(formatDateToMMDDYYYY(new Date())),
        students: await getStudents()
    };
}