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


// --- Schedules / Classes ---

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

// --- Define the data structure for creating a class ---
export interface ClassData {
    name: string; 
    description?: string; 
    schedule?: string;
    startDate?: string; 
    endDate?: string; 
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

        console.log('Class added successfully:', newRecord);
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

// --- End Schedules / Classes ---


// --- Check initial auth state ---
// console.log('Initial PocketBase auth state:', {
//     isValid: pb.authStore.isValid,
//     token: pb.authStore.token,
//     record: pb.authStore.record,
// });