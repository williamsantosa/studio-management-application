<script lang="ts">
	import { Button, Tabs, Tab, TabContent, Grid, Row } from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { pb, updateItemOrder } from '$lib/pocketbase'; // replace with your file
    import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
    import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
	let items: any = $state([]);
    let selected: number = $state(0);

	// Fetch items and sort by order
	async function loadItems() {
		items = await pb.collection('belts').getFullList({
			sort: '+order'
		});
	}

	onMount(loadItems);

	async function moveItem(index: number, direction: 'up' | 'down') {
		const newIndex = direction === 'up' ? index - 1 : index + 1;
		if (newIndex < 0 || newIndex >= items.length) return;

		// Swap orders
		const currentItem = items[index];
		const targetItem = items[newIndex];
		const tempOrder = currentItem.order;

		await updateItemOrder(currentItem.id, targetItem.order);
		await updateItemOrder(targetItem.id, tempOrder);

		await loadItems(); // Reload to reflect new order

        selected = newIndex;
	}
</script>

<Tabs type="container" bind:selected={selected}>
	{#each items as item, index}
		<Tab label={item.name} />
        <TabContent>
            <Button
                tooltipPosition="right"
                tooltipAlignment="end"
                iconDescription="Move Right"
                icon={ChevronRight}
                on:click={() => moveItem(index, 'down')}
                disabled={index === items.length - 1}
            />
            <Button
                tooltipPosition="right"
                tooltipAlignment="end"
                iconDescription="Move Left"
                icon={ChevronLeft}
                on:click={() => moveItem(index, 'up')}
                disabled={index === 0}
            />
        </TabContent>
	{/each}
</Tabs>
