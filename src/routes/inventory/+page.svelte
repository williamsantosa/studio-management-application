<script lang="ts">
	// Svelte imports
	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Button,
		Pagination,
		Grid,
		Row,
		Column,
		Form,
		FormGroup,
		TextInput,
        NumberInput
	} from 'carbon-components-svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';

	// Local imports
	import { 
        getInventory,
        addInventoryItem,
        deleteInventoryItem,
        updateInventoryItem,
	} from '$lib/pocketbase';
	import { InventoryHeaders } from '$lib/datamodels/InventoryHeaders.js';
	
	// Get data from server
	let { data } = $props();

	// Initialize headers and rows
	let headers = InventoryHeaders;

	// Initialize table data and rows
    let tableData: any = $state(data.inventory);
	let rows: any = $derived(
		tableData.map((inventoryObject: any) => ({
			id: inventoryObject.id,
			name: inventoryObject.name,
            quantity: inventoryObject.quantity,
            sellPrice: inventoryObject.sellPrice,
            vendor: inventoryObject.vendor
        }))
	);

	// Table variables
	let pageSize = $state(10);
	let page = $state(1);
	let active: boolean = $state(false);
	let selectedRowIds: Array<Number> = $state([]);

	// Form variables
    let addInventoryFormVariables: any = $state({
        name: '',
        quantity: 0,
        sellPrice: 0,
        vendor: ''
    });

	// Form variables
    let editInventoryFormVariables: any = $state({
        id: '',
        name: '',
        quantity: 0,
        sellPrice: 0,
        vendor: ''
    });

	// --- Functions ---

    /***
	 * Handle form submission for adding a class
	 * @param event - The form submission event
	 */
	async function handleAddInventorySubmit(event: SubmitEvent) {
		// Prevent default form submission
		event.preventDefault();
        $state.snapshot(`Attempting to add class with: ${addInventoryFormVariables}`);
		try {
            await addInventoryItem(addInventoryFormVariables);
            tableData = await getInventory();
		} catch (error: any) {
		} finally {
		}
	}

    /***
	 * Handle form submission for deleting a class
	 * * @param event - The form submission event
	 */
     async function handleDeleteInventorySubmit(event: MouseEvent) {
        // Prevent default form submission
        event.preventDefault();
        $state.snapshot(`Attempting to delete class with: ${selectedRowIds}`);
        try {
            selectedRowIds.forEach(async (selectedRowId: any) => {
                await deleteInventoryItem(selectedRowId);
            });
			selectedRowIds = [];
            tableData = await getInventory();
        } catch (error: any) {
        } finally {
        }
    }

    /***
     * Handle form submission for editing a class
     * @param event - The form submission event
     */
    async function handleEditInventorySubmit(event: SubmitEvent) {
        // Prevent default form submission
        event.preventDefault();
        $state.snapshot(`Attempting to edit class with: ${editInventoryFormVariables}`);
        try {
            await updateInventoryItem(editInventoryFormVariables.id, editInventoryFormVariables);
            tableData = await getInventory();
        } catch (error: any) {
        } finally {
        }
    }
</script>

<h3 style="display: block; margin-top: 1rem; margin-bottom: 1rem; text-align: center; ">Inventory</h3>

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
					editInventoryFormVariables.id = selectedRowIds[0];
					editInventoryFormVariables.name = rows.find((row: any) => row.id === selectedRowIds[0]).name;
                    editInventoryFormVariables.quantity = rows.find((row: any) => row.id === selectedRowIds[0]).quantity;
                    editInventoryFormVariables.sellPrice = rows.find((row: any) => row.id === selectedRowIds[0]).sellPrice;
                    editInventoryFormVariables.vendor = rows.find((row: any) => row.id === selectedRowIds[0]).vendor;
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
				on:click={(event) => {handleDeleteInventorySubmit(event)}}
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

<Grid fullWidth>
	<Form action="/classes/editclasses" method="POST" on:submit={handleEditInventorySubmit}>
		<FormGroup>
			<Row>
				{#each headers as header}
				<Column>
					{#if header.key in ['quantity', 'sellPrice']}
                        <NumberInput
                            bind:value={editInventoryFormVariables[header.key]}
                            id={header.key}
                            name={header.key}
                            label={header.value}
                            min={0}
                            required
                        />
					{:else}
						<TextInput id={header.key} labelText={header.value} name={header.key} required bind:value={editInventoryFormVariables[header.key]}/>
					{/if}
				</Column>
				{/each}
				<Button style="margin-top: 1rem;" type="submit">Edit Item</Button>
			</Row>
		</FormGroup>
	</Form>
</Grid>

<Grid fullWidth>
	<Form action="/classes/editclasses" method="POST" on:submit={handleAddInventorySubmit}>
		<FormGroup>
			<Row>
                <Column/>
				{#each headers.filter((h) => h.key !== 'id') as header}
				<Column>
					{#if header.key in ['quantity', 'sellPrice']}
                        <NumberInput
                            bind:value={addInventoryFormVariables[header.key]}
                            id={header.key}
                            name={header.key}
                            label={header.value}
                            min={0}
                            required
                        />
					{:else}
						<TextInput id={header.key} labelText={header.value} name={header.key} required bind:value={addInventoryFormVariables[header.key]}/>
					{/if}
				</Column>
				{/each}
				<Button style="margin-top: 1rem;" type="submit">Add Item</Button>
			</Row>
		</FormGroup>
	</Form>
</Grid>