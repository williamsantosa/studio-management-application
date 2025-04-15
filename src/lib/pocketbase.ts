import PocketBase from 'pocketbase';
import { writable } from 'svelte/store';

// Initialize PocketBase instance
export const pb = new PocketBase('http://45.33.55.97');

// Create a writable store for the current user record
// Initialize it with the current value from PocketBase's authStore.record
// pb.authStore.record holds the authenticated user record object, or null/undefined if not authenticated.
export const currentUser = writable(pb.authStore.record);

// Subscribe to PocketBase's auth store changes
// This event fires whenever the auth state changes (login, logout, token refresh)
pb.authStore.onChange((token, record) => {
    console.log('PocketBase authStore changed:', { token, record });
    currentUser.set(record);
}, true); // Passing 'true' as the second argument executes the callback immediately with the current state

/**
 * Authenticates a user with email and password.
 * @param {string} identifier - Email or Username
 * @param {string} password
 * @returns {Promise<import('pocketbase').RecordAuthResponse<any>>} The auth response
 */
export async function login(identifier: string, password: string): Promise<import('pocketbase').RecordAuthResponse<any>> {
    try {
        // Use authWithPassword which updates pb.authStore internally
        const authData = await pb.collection('users').authWithPassword(identifier, password);
        // The onChange handler above will automatically update the currentUser store
        console.log('Login successful:', authData);
        return authData;
    } catch (error) {
        console.error("Login failed:", error);
        // Re-throw the error for component-level handling
        throw error;
    }
}

/**
 * Authenticates a user via an OAuth2 provider.
 * @param {string} providerName - The name of the OAuth2 provider (e.g., 'google', 'github')
 */
export async function loginWithProvider(providerName: string) {
    try {
        // Use authWithOAuth2 which updates pb.authStore internally after redirect
        const authData = await pb.collection('users').authWithOAuth2({ provider: providerName });
        // If successful (after redirect), the onChange handler will update currentUser
        console.log('OAuth2 login initiated/completed:', authData);
        // Note: For OAuth2, the page usually redirects. The state update happens *after* the redirect back to your app.
        // The initial call might return metadata for the redirect URL.
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
    console.log(`Logging out (${pb.authStore.record})...`);
    // clear() clears the auth store (token and record)
    pb.authStore.clear();
    // The onChange handler above will automatically update the currentUser store (setting it to null/undefined)
    console.log('Logged out');
}

export function getCurrentUser() {
    // Return the current user record from the auth store
    return pb.authStore.record;
}

export function isUserAuthenticated() {
    // Check if the user is authenticated by checking the auth store's validity
    return pb.authStore.isValid;
}

// --- Check initial auth state ---
// Useful for debugging or initial setup
// console.log('Initial PocketBase auth state:', {
//     isValid: pb.authStore.isValid,
//     token: pb.authStore.token,
//     record: pb.authStore.record,
// });