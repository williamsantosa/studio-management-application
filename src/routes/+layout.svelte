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
		Content,
		Grid,
		Row,
		Column
	} from 'carbon-components-svelte';
	import Logout from 'carbon-icons-svelte/lib/Logout.svelte';
	import SettingsAdjust from 'carbon-icons-svelte/lib/SettingsAdjust.svelte';
	import UserAvatarFilledAlt from 'carbon-icons-svelte/lib/UserAvatarFilledAlt.svelte';

    let username: string = $state('William Santosa');

	let {
		children,
		company = "Koo's Martial Arts",
		platformName = '',
	}: {
		children: () => any;
		company?: string;
		platformName?: string;
	} = $props();

	let theme: 'white' | 'g10' | 'g80' | 'g90' | 'g100' = $state('g100');
	$effect(() => {
		document.documentElement.setAttribute('theme', theme);
	});
</script>

<Header href="/" {company} {platformName}>
	<svelte:fragment slot="skip-to-content">
		<SkipToContent />
	</svelte:fragment>
	<HeaderNav>
        <HeaderNavItem href="/classview" text="Class View" />
        <HeaderNavMenu text="Students">
            <HeaderNavItem href="/profile" text="Profiles" />
			<HeaderNavItem href="/leadership" text="Leadership" />
			<HeaderNavItem href="/tournament" text="Tournaments" />
			<HeaderNavItem href="/addclass" text="Add Class" />
		</HeaderNavMenu>
        <HeaderNavMenu text="Classes">
            <HeaderNavItem href="/schedule" text="Schedule" />
			<HeaderNavItem href="/editclasses" text="Edit Classes" />
		</HeaderNavMenu>
        <HeaderNavItem href="/inventory" text="Inventory" />
		<HeaderNavItem href="/transactions" text="Transactions" />
        <HeaderNavItem href="/logs" text="Logs" />
	</HeaderNav>
    <HeaderUtilities>
        <HeaderGlobalAction iconDescription={username} icon={UserAvatarFilledAlt} />
        <HeaderGlobalAction
          iconDescription="Settings"
          tooltipAlignment="start"
          icon={SettingsAdjust}
        />
        <HeaderGlobalAction
          iconDescription="Log out"
          tooltipAlignment="end"
          icon={Logout}
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

