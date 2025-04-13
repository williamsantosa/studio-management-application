<script lang="ts">
	import {
		Form,
		FormGroup,
		InlineNotification,
        InlineLoading,
		TextInput,
		PasswordInput,
		ButtonSet,
		Button,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';

	let username = $state('');
	let password = $state('');
	let isLoading = $state(false);
	let errorMessage = $state('');
	let successMessage = $state('');

	async function handleSubmit() {
		if (isLoading) return; // Prevent multiple submissions

		// Reset messages and set loading state
		errorMessage = '';
		successMessage = '';
		isLoading = true;

		// console.log('Attempting login with:', { username, password });

		try {
			// --- Simulate API Call ---
			// Replace this with your actual fetch() call to your backend endpoint
			await new Promise((resolve, reject) => {
				setTimeout(() => {
					// Basic validation example (in real app, backend does most validation)
					if (!username || !password) {
						reject(new Error('Please fill in both email and password.'));
					} else if (password === 'password123' && username.includes('@')) {
						// Simulate successful login
						resolve('Login successful!');
					} else {
						// Simulate failed login
						reject(new Error('Invalid email or password. Please try again.'));
					}
				}, 1500); // Simulate network delay
			});
			// --- End Simulation ---

			// If API call was successful
			successMessage = 'Login successful! Redirecting...';
			console.log('Login successful');
			// TODO: Redirect user or update application state (e.g., using goto from $app/navigation)
			// import { goto } from '$app/navigation';
			// goto('/dashboard');
		} catch (error: any) {
			// If API call failed or validation error occurred
			console.error('Login failed:', error);
			errorMessage = error.message || 'An unexpected error occurred.';
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
						bind:value={username}
						labelText="Username"
						placeholder="Enter Username"
						type="username"
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
