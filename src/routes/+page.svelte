<script lang="ts">
	import {
		Form,
		FormGroup,
		InlineNotification,
        InlineLoading,
		TextInput,
		PasswordInput,
		Button,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';

	import { login, logout } from '$lib/pocketbase';
	import { goto } from '$app/navigation';

	let identifier = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	/**
	 * Handles the form submission for login.
	 * Calls the PocketBase login function.
	 * Displays success or error messages and handles redirection.
	 */
	 async function handleSubmit(event: SubmitEvent) {
		// Prevent default form submission
		event.preventDefault();

		if (isLoading) return; // Prevent multiple submissions

		// Reset messages and set loading state
		errorMessage = '';
		successMessage = '';
		isLoading = true;

		console.log('Attempting PocketBase login with:', { identifier, password });

		try {
			// --- Call PocketBase Login ---
			// Pass the identifier (username/email) and password
			const authData = await login(identifier, password);
			// --- End PocketBase Login ---

			// If PocketBase login was successful
			successMessage = 'Login successful! Redirecting...';
			console.log('PocketBase Login successful, authData:', authData);

			// Redirect user to a protected route (e.g., dashboard)
			// Use await to ensure navigation is attempted before potentially finishing the function
			await goto('/dashboard'); // <-- ADJUST '/dashboard' to your desired route

		} catch (error: any) {
			// If PocketBase login failed
			console.error('PocketBase Login failed:', error);
			// PocketBase errors often have a user-friendly message in `error.message`
			// or more details in `error.data.data` for validation errors
			errorMessage = error.message || 'An unexpected error occurred during login.';
            // You could add more specific error handling based on error.status if needed
            // e.g., if (error.status === 400) { errorMessage = 'Invalid credentials.' }
		} finally {
			// Always turn off loading indicator
			isLoading = false;
		}
	}

	// --- Image Details ---
	const imageName = 'KoosMartialArts.webp';
	const imageAltText = 'A descriptive caption for the image';
	const imageSrc = `/images/${imageName}`;
	// --------------
</script>

<Grid fullWidth>
	<Row>
		<Column md={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 5 }}>
			<img
				src={imageSrc}
				alt={imageAltText}
				style="width: 100%; height: 100%; display: block; margin-top: 1rem;"
			/>
		</Column>
	</Row>
	<Row>
		<Column md={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 5 }}>
			<h2 style="text-align: center; margin-top: 2rem; margin-bottom: 1rem;">Log In</h2>
		</Column>
	</Row>
	<Row>
		<Column md={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 5 }}>
			<Form on:submit={handleSubmit}>
				<FormGroup>
					<TextInput
						bind:value={identifier}
						labelText="identifier"
						placeholder="Enter identifier"
						type="identifier"
						required
						disabled={isLoading}
						invalid={!!errorMessage}
						aria-describedby={errorMessage ? 'login-error-notification' : undefined}
					/>
				</FormGroup>

				<FormGroup>
					<PasswordInput
						bind:value={password}
						labelText="Password"
						placeholder="Enter your password"
						required
						disabled={isLoading}
						invalid={!!errorMessage}
						aria-describedby={errorMessage ? 'login-error-notification' : undefined}
					/>
				</FormGroup>
				<!-- Feedback Messages -->
				{#if errorMessage}
					<div style="margin-bottom: 1rem;">
						<InlineNotification
							id="login-error-notification"
							kind="error"
							title="Login Failed"
							subtitle={errorMessage}
							lowContrast
							hideCloseButton
						/>
					</div>
				{/if}

				{#if successMessage}
					<div style="margin-bottom: 1rem;">
						<InlineNotification
							kind="success"
							title="Success"
							subtitle={successMessage}
							lowContrast
							hideCloseButton
						/>
					</div>
				{/if}
				<!-- Submit Button & Loading Indicator -->
				<div style="margin-top: 1.5rem;">
					{#if isLoading}
						<InlineLoading description="Logging in..." />
					{:else}
						<Button type="submit" disabled={isLoading}>Log In</Button>
					{/if}
				</div>
			</Form>
		</Column>
	</Row>
</Grid>
