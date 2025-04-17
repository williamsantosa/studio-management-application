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
		TextInput
	} from 'carbon-components-svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';

	// Local imports
	import { 
		getClasses,
		addClass,
		deleteClass
	} from '$lib/pocketbase';
	import { ClassesHeaders } from '$lib/datamodels/ClassesHeaders.js';
	
	// Get data from server
	let { data } = $props();

	// Initialize headers and rows
	let headers = ClassesHeaders;

	// Initialize table data and rows
    let tableData: any = $state(data.classes);
	let rows: any = $derived(
		tableData.map((classObject: any) => ({
			id: classObject.id,
			name: classObject.name,
			description: classObject.description,
			schedule: classObject.schedule,
			startTime: classObject.startTime,
			endTime: classObject.endTime
		}))
	);

	// Table variables
	let pageSize = $state(10);
	let page = $state(1);
	let active: boolean = $state(false);
	let selectedRowIds: Array<Number> = $state([]);

	// Form variables
    let addClassFormVariables: any = $state({
        name: '',
        description: '',
        schedule: '',
        startTime: '',
        endTime: ''
    });

	// --- Functions ---

	/***
	 * Handle form submission for adding a class
	 * @param event - The form submission event
	 */
	async function handleAddClassSubmit(event: SubmitEvent) {
		// Prevent default form submission
		event.preventDefault();
        $state.snapshot(`Attempting to add class with: ${addClassFormVariables}`);
		try {
            await addClass(addClassFormVariables);
            tableData = await getClasses();
		} catch (error: any) {
		} finally {
		}
	}

	/***
	 * Handle form submission for deleting a class
	 * * @param event - The form submission event
	 */
    async function handleDeleteClassOnClick(event: MouseEvent) {
        // Prevent default form submission
        event.preventDefault();
        $state.snapshot(`Attempting to delete class with: ${selectedRowIds}`);
        try {
            selectedRowIds.forEach(async (selectedRowId: any) => {
                await deleteClass(selectedRowId);
            });
			selectedRowIds = [];
            tableData = await getClasses();
        } catch (error: any) {
        } finally {
        }
    }
</script>

<h3 style="display: block; margin-top: 1rem; margin-bottom: 1rem; text-align: center; ">Classes</h3>

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
				on:click={() => {
					rows = rows.filter((row: any) => !selectedRowIds.includes(Number(row.id)));
					selectedRowIds = [];
				}}
			>
				Edit
			</Button>
			<Button
				icon={TrashCan}
				disabled={selectedRowIds.length === 0}
				on:click={(event) => {handleDeleteClassOnClick(event)}}
			>
				Delete
			</Button>
		</ToolbarBatchActions>
		<ToolbarContent>
			<Button on:click={() => (active = true)}>Delete/Edit Row(s)</Button>
		</ToolbarContent>
	</Toolbar>
</DataTable>

<Pagination bind:pageSize bind:page totalItems={tableData.length} pageSizeInputDisabled />

<h3 style="display: block; margin-top: 1rem; margin-bottom: 1rem; text-align: center; ">
	Add Class
</h3>

<Grid fullWidth>
	<Form action="/classes/editclasses" method="POST" on:submit={handleAddClassSubmit}>
		<FormGroup>
			<Row>
				{#each headers.filter((h) => h.key !== 'id') as header}
					<Column>
						<TextInput id={header.key} labelText={header.value} name={header.key} required bind:value={addClassFormVariables[header.key]}/>
					</Column>
				{/each}
			</Row>
		</FormGroup>
		<Button type="submit">Add Class</Button>
	</Form>
</Grid>