<script lang="ts">
	import {
		Button,
		Tabs,
		Tab,
		TabContent,
		Grid,
		Row,
		Column,
		Form,
		FormGroup,
		NumberInput,
		TextInput
	} from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { pb, updateItemOrder } from '$lib/pocketbase'; // replace with your file
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
    import { TrashCan

     } from 'carbon-icons-svelte';
	let items: any = $state([]);
	let selected: number = $state(0);
	let beltName: string = $state('');

	// Fetch items and sort by order
	async function loadItems() {
		items = await pb.collection('belts').getFullList({
			sort: '+order'
		});
	}

	onMount(loadItems);

	async function moveItem(index: number, direction: 'left' | 'right') {
		const newIndex = direction === 'left' ? index - 1 : index + 1;
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

	async function addBeltSubmit(event: SubmitEvent) {
		event.preventDefault(); // Prevent default form submission

		if (!beltName) return; // Ensure belt name is not empty

		try {
			const newBelt = await pb.collection('belts').create({ name: beltName, order: items.length });
			beltName = ''; // Reset input field
            await loadItems(); // Reload to reflect new order
		} catch (error) {
			console.error('Error adding new belt:', error);
		}
	}

    async function removeItem(id: string, order: number) {
        try {
            await pb.collection('belts').delete(id);
            items = items.filter((item: any) => item.id !== id); // Remove the item from the list
            // If order of the removed item is less than the last item, update the order of the remaining items
            if (order < items.length) {
                for (let i = order; i < items.length; i++) {
                    await pb.collection('belts').update(items[i].id, { order: i });
                }
            }
            await loadItems(); // Reload to reflect new order
        } catch (error) {
            console.error('Error removing belt:', error);
        }
    }
</script>

<h3 style="text-align: center;">Belts</h3>

<Grid fullWidth >
	<Row>
		<Column md={{ span: 6, offset: 1 }} lg={{ span: 14, offset: 2 }}>
			<Tabs type="container" bind:selected style="margin-top: 1rem;">
				{#each items as item, index}
					<Tab label={item.name} />
					<TabContent>
                        <Button
							tooltipPosition="right"
							tooltipAlignment="end"
							iconDescription="Move left"
							icon={ChevronLeft}
							on:click={() => moveItem(index, 'left')}
							disabled={index === 0}
						/>
						<Button
							tooltipPosition="right"
							tooltipAlignment="end"
							iconDescription="Move right"
							icon={ChevronRight}
							on:click={() => moveItem(index, 'right')}
							disabled={index === items.length - 1}
						/>
                        <Button
							tooltipPosition="right"
							tooltipAlignment="end"
							iconDescription="Remove belt"
							icon={TrashCan}
							on:click={() => removeItem(item.id, index)}
						/>
					</TabContent>
				{/each}
			</Tabs>
		</Column>
	</Row>
</Grid>

<Grid fullWidth style="margin-top: 8rem;">
	<Form action="/classes/editclasses" method="POST" on:submit={addBeltSubmit}>
		<FormGroup>
			<Grid>
				<Row>
					<Column md={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 5 }}>
						<TextInput
							id="beltName"
							labelText="Belt Name"
							name="Belt Name"
							required
							bind:value={beltName}
						/>
					</Column>
					<Column md={{ span: 6, offset: 1 }} lg={{ span: 6, offset: 5 }}>
						<Button style="margin-top: 1rem;" type="submit">Add Belt</Button>
					</Column>
				</Row>
			</Grid>
		</FormGroup>
	</Form>
</Grid>

<h3 style="text-align: center;">Requirements</h3>