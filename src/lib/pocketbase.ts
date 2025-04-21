import PocketBase, { type CollectionModel, type RecordModel } from 'pocketbase';
import { writable } from 'svelte/store';

// Initialize PocketBase instance
export const pb = new PocketBase('http://45.33.55.97'); // Replace with your PB instance URL

// --- Auth Store Setup ---
export const currentUser = writable(pb.authStore.record);
pb.authStore.onChange((token, record) => {
    console.log('PocketBase authStore changed:', { token, record });
    currentUser.set(record);
}, true);

// --- Auth Functions ---

/**
 * Authenticates a user with email and password.
 * @param {string} identifier - Email or Username
 * @param {string} password
 * @returns {Promise<import('pocketbase').RecordAuthResponse<any>>} The auth response
 */
export async function login(identifier: string, password: string): Promise<import('pocketbase').RecordAuthResponse<any>> {
    try {
        const authData = await pb.collection('users').authWithPassword(identifier, password);
        console.log('Login successful:', authData);
        return authData;
    } catch (error) {
        console.error("Login failed:", error);
        throw error;
    }
}

/**
 * Authenticates a user via an OAuth2 provider.
 * @param {string} providerName - The name of the OAuth2 provider (e.g., 'google', 'github')
 */
export async function loginWithProvider(providerName: string) {
    try {
        const authData = await pb.collection('users').authWithOAuth2({ provider: providerName });
        console.log('OAuth2 login initiated/completed:', authData);
        return authData;
    } catch (error) {
        console.error(`OAuth2 login with ${providerName} failed:`, error);
        throw error;
    }
}

/**
 * Logs out the current user.
 */
export function logout() {
    console.log(`Logging out (${pb.authStore.record?.id})...`);
    pb.authStore.clear();
    console.log('Logged out');
}

export function getCurrentUser() {
    return pb.authStore.record;
}

export function isUserAuthenticated() {
    return pb.authStore.isValid;
}


// ---  Classes ---

/**
 * Retrieves a full list of classes.
 * @returns {Promise<RecordModel[]>} A promise that resolves to an array of class records.
 */
export async function getClasses(): Promise<RecordModel[]> {
    // Consider adding options like filter or expand if needed
    return await pb.collection('classes').getFullList({
        sort: '-created', // Example sort
    });
}

export interface ClassData {
    name: string; 
    description?: string; 
    day?: string;
    startTime?: string; 
    endTime?: string; 
}

/**
 * Creates a new class record in the 'classes' collection.
 * Requires authentication and appropriate permissions set in PocketBase.
 * @param {ClassData} classData - The data for the new class.
 * @returns {Promise<RecordModel>} The newly created class record.
 * @throws {Error} Throws an error if the creation fails (e.g., validation, permission).
 */
export async function addClass(classData: ClassData): Promise<RecordModel> {
    try {
        // Ensure required fields are provided (basic client-side check)
        if (!classData.name) {
            throw new Error('Class name is required.');
        }

        // Call PocketBase SDK's create method for the 'classes' collection
        // This assumes the logged-in user has 'create' permissions for the 'classes' collection

        const newRecord = await pb.collection('classes').create(classData);
        console.log('Class created successfully:', newRecord);

        return newRecord; // Return the newly created record object
    } catch (error: any) {
        console.error('Failed to add class:', error);
        // It's often helpful to log the full PocketBase error structure
        console.error('PocketBase error details:', error.data);
        // Re-throw the error so the calling component can handle it (e.g., display UI message)
        // You might want to process the error message here before re-throwing
        // e.g., throw new Error(error.data?.message || 'Failed to add class due to an unknown error.');
        throw error;
    }
}

export async function deleteClass(classId: string): Promise<void> {
    try {
        // Ensure the classId is provided
        if (!classId) {
            throw new Error('Class ID is required for deletion.');
        }

        // Call PocketBase SDK's delete method for the 'classes' collection
        await pb.collection('classes').delete(classId);

        console.log(`Class with ID ${classId} deleted successfully.`);
    } catch (error: any) {
        console.error('Failed to delete class:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

export async function updateClass(classId: string, classData: ClassData): Promise<RecordModel> {
    try {
        // Ensure the classId and classData are provided
        if (!classId) {
            throw new Error('Class ID is required for update.');
        }
        if (!classData.name) {
            throw new Error('Class name is required for update.');
        }
        
        // Call PocketBase SDK's update method for the 'classes' collection
        const updatedRecord = await pb.collection('classes').update(classId, classData);

        console.log('Class updated successfully:', updatedRecord);
        return updatedRecord; // Return the updated record object
    } catch (error: any) {
        console.error('Failed to update class:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}


/**
 * Retrieves a full list of classes that start on a specific date.
 * Assumes the 'classes' collection has a 'startDate' field (Date or DateTime).
 * Filters for classes starting between 00:00:00 and 23:59:59 on the given date (UTC).
 *
 * @param {Date} targetDate - The specific date to filter classes by.
 * @returns {Promise<RecordModel[]>} A promise that resolves to an array of class records starting on that date.
 * @throws {Error} Throws an error if the retrieval fails or the date is invalid.
 */
export async function getClassesStartingOn(day: string) {
    try {
        const result = await pb.collection('classes').getFullList({
            filter: `day = "${day}"`,
            sort: '+startTime'
        });

        return result;
    } catch (error) {
        console.error('Error fetching classes for day:', day, error);
        throw error;
    }
}

// --- Inventory Functions ---

export interface InventoryData {
    name: string; 
    quantity: number; 
    sellPrice: number; 
    vendor?: string; 
}

export async function getInventory(): Promise<RecordModel[]> {
    // Consider adding options like filter or expand if needed
    return await pb.collection('inventory').getFullList({
        sort: '-created', // Example sort
    });
}

export async function addInventoryItem(itemData: InventoryData): Promise<RecordModel> {
    try {
        // Ensure required fields are provided (basic client-side check)
        if (!itemData.name || itemData.quantity < 0 || itemData.sellPrice < 0) {
            throw new Error('Name, quantity, and sell price are required.');
        }

        // Call PocketBase SDK's create method for the 'inventory' collection
        const newRecord = await pb.collection('inventory').create(itemData);
        console.log('Inventory item created successfully:', newRecord);

        return newRecord; // Return the newly created record object
    }
    catch (error: any) {
        console.error('Failed to add inventory item:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

export async function deleteInventoryItem(itemId: string): Promise<void> {
    try {
        // Ensure the itemId is provided
        if (!itemId) {
            throw new Error('Item ID is required for deletion.');
        }

        // Call PocketBase SDK's delete method for the 'inventory' collection
        await pb.collection('inventory').delete(itemId);

        console.log(`Inventory item with ID ${itemId} deleted successfully.`);
    }
    catch (error: any) {
        console.error('Failed to delete inventory item:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

export async function updateInventoryItem(itemId: string, itemData: InventoryData): Promise<RecordModel> {
    try {
        // Ensure the itemId and itemData are provided
        if (!itemId) {
            throw new Error('Item ID is required for update.');
        }
        if (!itemData.name || itemData.quantity < 0 || itemData.sellPrice < 0) {
            throw new Error('Name, quantity, and sell price are required for update.');
        }

        // Call PocketBase SDK's update method for the 'inventory' collection
        const updatedRecord = await pb.collection('inventory').update(itemId, itemData);

        console.log('Inventory item updated successfully:', updatedRecord);
        return updatedRecord; // Return the updated record object
    }
    catch (error: any) {
        console.error('Failed to update inventory item:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

export async function updateItemOrder(itemId: string, newOrder: number): Promise<RecordModel> {
    try {
        const updated = await pb.collection('belts').update(itemId, { order: newOrder });
        console.log(`Updated order for ${itemId} to ${newOrder}`, updated);
        return updated;
    } catch (error: any) {
        console.error(`Failed to update order for ${itemId}:`, error);
        throw error;
    }
}


/**
 * Formats a Date object into 'YYYY-MM-DD' string format (UTC).
 * @param {Date} date - The date object to format.
 * @returns {string} The date string in 'YYYY-MM-DD' format.
 */
function formatDateToYYYYMMDD(date: Date): string {
    // Ensures the date is treated as UTC for consistency with PocketBase storage
	return date.toISOString().split('T')[0];
}

// --- End Schedules / Classes ---

// Belt Requirements

export async function getBeltRequirements(): Promise<RecordModel[]> {
    return await pb.collection('beltRequirements').getFullList({
        sort: '-created', // Example sort
    });
}

// Students

export interface StudentData {
    name: string; 
    dateOfBirth?: string;
    email?: string;
    phoneNumber?: string;
    address?: string;
    currentBelt?: string;
    earnedBeltDate?: string;
    profilePicture?: Array<File>;
}

export async function getStudents(): Promise<RecordModel[]> {
    return await pb.collection('students').getFullList({
        sort: '-created', // Example sort
    });
}

export async function addStudent(studentData: StudentData): Promise<RecordModel> {
    try {
        // Ensure required fields are provided (basic client-side check)
        if (!studentData.name) {
            throw new Error('Student name is required.');
        }

        // Call PocketBase SDK's create method for the 'students' collection
        const newRecord = await pb.collection('students').create(studentData);
        console.log('Student created successfully:', newRecord);

        return newRecord; // Return the newly created record object
    } catch (error: any) {
        console.error('Failed to add student:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

export async function deleteStudent(studentId: string): Promise<void> {
    try {
        // Ensure the studentId is provided
        if (!studentId) {
            throw new Error('Student ID is required for deletion.');
        }

        // Call PocketBase SDK's delete method for the 'students' collection
        await pb.collection('students').delete(studentId);

        console.log(`Student with ID ${studentId} deleted successfully.`);
    } catch (error: any) {
        console.error('Failed to delete student:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

export async function editStudent(studentId: string, studentData: StudentData): Promise<RecordModel> {
    try {
        // Ensure the studentId and studentData are provided
        if (!studentId) {
            throw new Error('Student ID is required for update.');
        }
        if (!studentData.name) {
            throw new Error('Student name is required for update.');
        }

        // Call PocketBase SDK's update method for the 'students' collection
        const updatedRecord = await pb.collection('students').update(studentId, studentData);

        console.log('Student updated successfully:', updatedRecord);
        return updatedRecord; // Return the updated record object
    } catch (error: any) {
        console.error('Failed to update student:', error);
        // Log the full PocketBase error structure for debugging
        console.error('PocketBase error details:', error.data);
        throw error;
    }
}

// --- Check initial auth state ---
// console.log('Initial PocketBase auth state:', {
//     isValid: pb.authStore.isValid,
//     token: pb.authStore.token,
//     record: pb.authStore.record,
// });