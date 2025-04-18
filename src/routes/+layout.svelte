<script lang="ts">
	// Styling
	import 'carbon-components-svelte/css/all.css';

	// Svelte imports
	import {
		Header,
		HeaderNav,
		HeaderNavItem,
		HeaderNavMenu,
		HeaderUtilities,
		HeaderGlobalAction,
		SkipToContent,
		SideNav,
		SideNavItems,
		SideNavMenu,
		SideNavMenuItem,
		SideNavLink,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import { goto } from '$app/navigation';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	// Local imports
	import { currentUser, logout } from '$lib/pocketbase';
	import { MenuComponents } from '$lib/datamodels/MenuComponents' 

	// Get props from parent component
	let {
		children,
		company = "Koo's Martial Arts",
		platformName = ''
	}: {
		children: () => any;
		company?: string;
		platformName?: string;
	} = $props();

	// Set theme, default to 'g100'
	let theme: 'white' | 'g10' | 'g80' | 'g90' | 'g100' = $state('g100');
	$effect(() => {
		document.documentElement.setAttribute('theme', theme);
	});

	// Set up state variables
	let userName: string = $derived($currentUser ? ($currentUser?.name || 'No Name Provided') : 'Guest');
	let isSideNavOpen: boolean = $state(false);
	let expandedByDefault: boolean = false;

	// --- Functions ---
	function handleLogout() {
		$state.snapshot($currentUser);
		logout();
		goto('/'); // Redirect to login page after logout
		$state.snapshot($currentUser);
	}
</script>

<Header href="/" {company} {platformName} bind:isSideNavOpen {expandedByDefault}>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		{#each MenuComponents as { text, href, components }}
			{#if components}
				<HeaderNavMenu {text}>
					{#each components as { text: componentText, href: componentHref }}
						<HeaderNavItem href={componentHref} text={componentText} />
					{/each}
				</HeaderNavMenu>
			{:else}
				<HeaderNavItem {href} {text} />
			{/if}
		{/each}
	</HeaderNav>
	<SideNav bind:isOpen={isSideNavOpen}>
		<SideNavItems>
			{#each MenuComponents as { text, href, components }}
				{#if components}
					<SideNavMenu {text}>
						{#each components as { text: componentText, href: componentHref }}
							<SideNavMenuItem href={componentHref} text={componentText} />
						{/each}
					</SideNavMenu>
				{:else}
					<SideNavLink {href} {text} />
				{/if}
			{/each}
		</SideNavItems>
	</SideNav>
	<HeaderUtilities>
		<HeaderGlobalAction iconDescription={userName} icon={UserAvatarFilledAlt} />
		<HeaderGlobalAction iconDescription="Settings" tooltipAlignment="start" icon={SettingsAdjust} />
		<HeaderGlobalAction
			iconDescription="Log out"
			tooltipAlignment="end"
			icon={Logout}
			on:click={handleLogout}
		/>
	</HeaderUtilities>
</Header>

<Content>
	<Grid fullWidth>
		<Row>
			<Column>
				{@render children()}
			</Column>
		</Row>
	</Grid>
</Content>
