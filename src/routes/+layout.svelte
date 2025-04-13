<script lang="ts">
	import 'carbon-components-svelte/css/all.css';

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
		SideNavDivider,
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

	let username: string = $state('William Santosa');
	let isSideNavOpen: boolean = $state(false);
	let expandedByDefault: boolean = false;

	let {
		children,
		company = "Koo's Martial Arts",
		platformName = ''
	}: {
		children: () => any;
		company?: string;
		platformName?: string;
	} = $props();

	let theme: 'white' | 'g10' | 'g80' | 'g90' | 'g100' = $state('g100');
	$effect(() => {
		document.documentElement.setAttribute('theme', theme);
	});

	let menu_components: Array<{
		text: string;
		href?: string;
		components?: Array<{ text: string; href: string }>;
	}> = [
		{ text: 'Class View', href: '/classview' },
		{
			text: 'Students',
			components: [
				{ text: 'Profiles', href: '/students/profiles' },
				{ text: 'Leadership', href: '/students/leadership' },
				{ text: 'Tournaments', href: '/students/tournaments' },
				{ text: 'Add Missing Class', href: '/students/addmissingclass' }
			]
		},
		{
			text: 'Classes',
			components: [
				{ text: 'Schedule', href: '/classes/schedule' },
				{ text: 'Edit Classes', href: '/classes/editclasses' }
			]
		},
		{
			text: 'Manage Studio',
			components: [
				{ text: 'Belt Requirements', href: '/managestudio/beltrequirements' },
				{ text: 'Print Student ID Card', href: '/managestudio/printstudentcards' }
			]
		},
		{
			text: 'Transactions',
			components: [
				{ text: 'Payments', href: '/transactions/payments' },
				{ text: 'Refunds', href: '/transactions/refunds' },
				{ text: 'Memberships', href: '/transactions/memberships' }
			]
		},
		{ text: 'Inventory', href: '/inventory' },
		{ text: 'Logs', href: '/logs' }
	];
</script>

<Header href="/" {company} {platformName} bind:isSideNavOpen {expandedByDefault}>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
		{#each menu_components as { text, href, components }}
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
			{#each menu_components as { text, href, components }}
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
		<HeaderGlobalAction iconDescription={username} icon={UserAvatarFilledAlt} />
		<HeaderGlobalAction iconDescription="Settings" tooltipAlignment="start" icon={SettingsAdjust} />
		<HeaderGlobalAction iconDescription="Log out" tooltipAlignment="end" icon={Logout} />
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
