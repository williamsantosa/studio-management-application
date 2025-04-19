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
		DatePicker,
		DatePickerInput
	} from 'carbon-components-svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';
	import Edit from 'carbon-icons-svelte/lib/Edit.svelte';

	// Local imports
	import { 
		getClasses,
		addClass,
		deleteClass,
		updateClass
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
			day: classObject.day,
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
		day: '',
        startTime: '',
        endTime: ''
    });

	// Form variables
    let editClassFormVariables: any = $state({
        id: '',
		name: '',
        description: '',
		day: '',
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

	/***
	 * Handle form submission for editing a class
	 * * @param event - The form submission event
	 */
	async function handleEditClassSubmit(event: SubmitEvent) {
		// Prevent default form submission
		event.preventDefault();
		$state.snapshot(`Attempting to edit class with: ${editClassFormVariables}`);
		try {
			await updateClass(editClassFormVariables.id,editClassFormVariables);
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
				on:click={(e) => {
					editClassFormVariables.id = selectedRowIds[0];
					editClassFormVariables.name = rows.find((row: any) => row.id === selectedRowIds[0]).name;
					editClassFormVariables.description = rows.find((row: any) => row.id === selectedRowIds[0]).description;
					editClassFormVariables.day = rows.find((row: any) => row.id === selectedRowIds[0]).day;
					editClassFormVariables.startTime = rows.find((row: any) => row.id === selectedRowIds[0]).startTime;
					editClassFormVariables.endTime = rows.find((row: any) => row.id === selectedRowIds[0]).endTime;
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
				on:click={(event) => {handleDeleteClassOnClick(event)}}
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
	<Form action="/classes/editclasses" method="POST" on:submit={handleEditClassSubmit}>
		<FormGroup>
			<Row>
				{#each headers as header}
				<Column>
					{#if header.key.toLowerCase().includes("time")}
						<TextInput
						bind:value={editClassFormVariables[header.key]}
							id={header.key}
							name={header.key}
							labelText={header.value}
							placeholder="hh:mm"
							pattern={'^([0-9]|1\\d|2[0-3]):([0-5]\\d)$'}
							title="Day"
							required
						/>
					{:else if header.key === "day"}
						<DatePicker datePickerType="single" bind:value={editClassFormVariables[header.key]}>
							<DatePickerInput id={header.key} placeholder="mm/dd/yyyy" labelText={header.value}  />
						</DatePicker>
					{:else}
						<TextInput id={header.key} labelText={header.value} name={header.key} required bind:value={editClassFormVariables[header.key]}/>
					{/if}
				</Column>
				{/each}
				<Button style="margin-top: 1rem;" type="submit">Edit Class</Button>
			</Row>
		</FormGroup>
	</Form>
</Grid>

<Grid fullWidth>
	<Form action="/classes/editclasses" method="POST" on:submit={handleAddClassSubmit}>
		<FormGroup>
			<Row>
				<Column/>
				{#each headers.filter((h) => h.key !== 'id') as header}
					<Column>
						{#if header.key.toLowerCase().includes("time")}
							<TextInput
							bind:value={addClassFormVariables[header.key]}
								id={header.key}
								name={header.key}
								labelText={header.value}
								placeholder="hh:mm"
								pattern={'^([0-9]|1\\d|2[0-3]):([0-5]\\d)$'}
								title="Day"
								required
							/>
						{:else if header.key === "day"}
							<DatePicker datePickerType="single" bind:value={addClassFormVariables[header.key]}>
								<DatePickerInput id={header.key} placeholder="mm/dd/yyyy" labelText={header.value}  />
							</DatePicker>
						{:else}
							<TextInput id={header.key} labelText={header.value} name={header.key} required bind:value={addClassFormVariables[header.key]}/>
						{/if}
					</Column>
				{/each}
				<Button style="margin-top: 1rem;" type="submit">Add Class</Button>
			</Row>
		</FormGroup>
	</Form>
</Grid>

