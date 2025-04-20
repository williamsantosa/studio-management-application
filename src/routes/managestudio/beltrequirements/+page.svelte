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
		TextInput,
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Pagination
	} from 'carbon-components-svelte';
	import { onMount } from 'svelte';
	import { pb, updateItemOrder } from '$lib/pocketbase'; // replace with your file
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
    import { TrashCan, Edit} from 'carbon-icons-svelte';
	import { BeltRequirementsHeaders } from '$lib/datamodels/BeltRequirementsHeaders';
	// State
	let items: any = $state([]);
	let selected: number = $state(0);
    let selectedBeltName: string = $derived(items[selected]?.name || '');
    let requirements: any = $derived(0);
	let addBeltName: string = $state('');
    let requirementName: string = $state('');
    let requirementDescription: string = $state('');

	// Initialize table data and rows
	let { data } = $props();

    let tableData: any = $state(data.beltRequirements);
	let rows: any = $derived(
		tableData.filter((r: any) => r.beltName === selectedBeltName).map((beltRequirementObject: any) => ({
			id: beltRequirementObject.id,
			beltName: beltRequirementObject.beltName,
			requirementName: beltRequirementObject.requirementName,
			description: beltRequirementObject.description,
        }))
	);

	// Table variables
	const headers = BeltRequirementsHeaders;

	let pageSize = $state(10);
	let page = $state(1);
	let active: boolean = $state(false);
	let selectedRowIds: Array<Number> = $state([]);

	// Form variables
    let editBeltRequirementFormVariables: any = $state({
        id: '',
		beltName: '',
		requirementName: '',
		description: ''
    });

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

		if (!addBeltName) return; // Ensure belt name is not empty

		try {
			const newBelt = await pb.collection('belts').create({ name: addBeltName, order: items.length });
			addBeltName = ''; // Reset input field
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

    async function addBeltRequirementSubmit(event: SubmitEvent) {
        event.preventDefault(); // Prevent default form submission
        try { 
            const newRequirement = await pb.collection('beltRequirements').create({
                beltName: selectedBeltName,
                requirementName: requirementName,
                description: requirementDescription,
            });
            requirementName = ''; // Reset input field
            requirementDescription = ''; // Reset input field
            requirements = await pb.collection('beltRequirements').getFullList({ filter: `beltName="${selectedBeltName}"` });
        } catch (error) {
            console.error('Error adding new requirement:', error);
        }
    }

	async function handleDeleteBeltRequirementSubmit(event: MouseEvent) {
		event.preventDefault(); // Prevent default form submission
		try {
			selectedRowIds.forEach(async (selectedRowId: any) => {
				await pb.collection('beltRequirements').delete(selectedRowId);
			});
			selectedRowIds = []; // Clear selected row IDs
			tableData = await pb.collection('beltRequirements').getFullList({ filter: `beltName="${selectedBeltName}"` });
		} catch (error) {
			console.error('Error deleting belt requirement:', error);
		}
	}

	async function editBeltRequirementSubmit(event: SubmitEvent) {
		event.preventDefault(); // Prevent default form submission
		try {
			await pb.collection('beltRequirements').update(editBeltRequirementFormVariables.id, {
				beltName: editBeltRequirementFormVariables.beltName,
				requirementName: editBeltRequirementFormVariables.requirementName,
				description: editBeltRequirementFormVariables.description,
			});
			editBeltRequirementFormVariables = { id: '', beltName: '', requirementName: '', description: '' }; // Reset input fields
			tableData = await pb.collection('beltRequirements').getFullList({ filter: `beltName="${selectedBeltName}"` });
		} catch (error) {
			console.error('Error editing belt requirement:', error);
		}
	}
</script>

<h3 style="text-align: center;">Belts</h3>

<Grid fullWidth >
	<Row>
		<Column md={{ span: 6, offset: 1 }} lg={{ span: 12, offset: 2 }}>
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

<Grid fullWidth style="margin-top: 10rem;">
	<Form action="/classes/editclasses" method="POST" on:submit={addBeltSubmit}>
		<FormGroup>
			<Grid>
				<Row>
					<Column md={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 5 }}>
						<TextInput
							id="addBeltName"
							labelText="Belt Name"
							name="Belt Name"
							required
							bind:value={addBeltName}
						/>
					</Column>
					<Column md={{ span: 6, offset: 1 }} lg={{ span: 2, offset: 0 }}>
						<Button style="margin-top: 1rem;" type="submit">Add Belt</Button>
					</Column>
				</Row>
			</Grid>
		</FormGroup>
	</Form>
</Grid>

<h3 style="text-align: center;">Requirements</h3>

<Grid fullWidth style="margin-top: 1rem;">
	<Form action="/classes/editclasses" method="POST" on:submit={editBeltRequirementSubmit}>
		<FormGroup>
			<Grid>
				<Row>
					<Column md={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 0 }}>
						<TextInput
							id="addRequirementID"
							labelText="Requirement ID"
							name="Requiremment ID"
							required
							bind:value={editBeltRequirementFormVariables.id}
						/>
					</Column>
					<Column md={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 0 }}>
						<TextInput
							id="addRequirementName"
							labelText="Requirement"
							name="Requiremment Name"
							required
							bind:value={editBeltRequirementFormVariables.requirementName}
						/>
					</Column>
                    <Column md={{ span: 2, offset: 1 }} lg={{ span: 5, offset: 0 }}>
						<TextInput
							id="addRequirementDescription"
							labelText="Description"
							name="Requirement Description"
							required
							bind:value={editBeltRequirementFormVariables.description}
						/>
					</Column>
					<Column md={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 0 }}>
						<Button style="margin-top: 1rem;" type="submit">Edit Requirement</Button>
					</Column>
				</Row>
			</Grid>
		</FormGroup>
	</Form>
</Grid>

<Grid fullWidth style="margin-top: 1rem;">
	<Form action="/classes/editclasses" method="POST" on:submit={addBeltRequirementSubmit}>
		<FormGroup>
			<Grid>
				<Row>
					<Column md={{ span: 3, offset: 1 }} lg={{ span: 3, offset: 3 }}>
						<TextInput
							id="addRequirementName"
							labelText="Requirement"
							name="Requiremment Name"
							required
							bind:value={requirementName}
						/>
					</Column>
                    <Column md={{ span: 5, offset: 1 }} lg={{ span: 5, offset: 0 }}>
						<TextInput
							id="addRequirementDescription"
							labelText="Description"
							name="Requirement Description"
							required
							bind:value={requirementDescription}
						/>
					</Column>
					<Column md={{ span: 6, offset: 1 }} lg={{ span: 4, offset: 0 }}>
						<Button style="margin-top: 1rem;" type="submit">Add Requirement</Button>
					</Column>
				</Row>
			</Grid>
		</FormGroup>
	</Form>
</Grid>

<DataTable
	selectable
	batchSelection={active}
	bind:selectedRowIds
	{headers}
	{rows}
	{pageSize}
	{page}
>
	<Toolbar>
		<ToolbarBatchActions
			bind:active
			on:cancel={(e) => {
				e.preventDefault();
				active = false;
			}}
		>
			<Button
				icon={Edit}
				disabled={selectedRowIds.length !== 1}
				on:click={(e) => {
					editBeltRequirementFormVariables.id = selectedRowIds[0];
					editBeltRequirementFormVariables.beltName = rows.find((row: any) => row.id === selectedRowIds[0]).beltName;
					editBeltRequirementFormVariables.requirementName = rows.find((row: any) => row.id === selectedRowIds[0]).requirementName;
					editBeltRequirementFormVariables.description = rows.find((row: any) => row.id === selectedRowIds[0]).description;
                    e.preventDefault();
                    selectedRowIds = [];
					active = false;
				}}
			>
				Edit
			</Button>
			<Button
				icon={TrashCan}
				disabled={selectedRowIds.length === 0}
				on:click={(event) => {handleDeleteBeltRequirementSubmit(event)}}
			>
				Delete
			</Button>
		</ToolbarBatchActions>
		<ToolbarContent>
			<Button on:click={() => (active = true)}>Edit/Delete Row(s)</Button>
		</ToolbarContent>
	</Toolbar>
</DataTable>

<Pagination style="margin-bottom: 2rem;" bind:pageSize bind:page totalItems={tableData.length} pageSizeInputDisabled />