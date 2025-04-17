<script lang="ts">
	import { getClasses } from '$lib/pocketbase';
    let { data } = $props();

	import {
		DataTable,
		Toolbar,
		ToolbarContent,
		ToolbarBatchActions,
		Button
	} from 'carbon-components-svelte';
	import TrashCan from 'carbon-icons-svelte/lib/TrashCan.svelte';

	// const headers = 

	type DataTableHeader<T> = {
		key: keyof T;
		value: string;
	};

	const headers: DataTableHeader<{
		id: number;
		name: string;
		description: string;
		schedule: string;
		startTime: string;
		endTime: string;
	}>[] | undefined = [
		{ key: 'id', value: 'ID' },
		{ key: 'name', value: 'Name' },
		{ key: 'description', value: 'Description' },
		{ key: 'schedule', value: 'Schedule' },
		{ key: 'startTime', value: 'StartTime' },
		{ key: 'endTime', value: 'EndTime' }
	];
    
    // let rows = $state([
	// 	{
	// 		id: 1,
	// 		name: 'Class 1',
	// 		description: 'Description 1',
	// 		schedule: 'Monday',
	// 		startTime: '10:00 AM',
	// 		endTime: '11:00 AM'
	// 	},
	// 	{
	// 		id: 2,
	// 		name: 'Class 2',
	// 		description: 'Description 2',
	// 		schedule: 'Tuesday',
	// 		startTime: '11:00 AM',
	// 		endTime: '12:00 PM'
	// 	}
	// ]);

    let rows: any = $state(data.summaries.map((classObject: any) => ({
        id: classObject.id,
        name: classObject.name,
        description: classObject.description,
        schedule: classObject.schedule,
        startTime: classObject.startTime,
        endTime: classObject.endTime
    })));

	let active: boolean = $state(false);
	let selectedRowIds: Array<Number> = $state([]);
</script>

{#await getClasses()}
	<!-- Optional: Show a loading state -->
	<p>Loading classes...</p>
{:then classes}
	<DataTable selectable batchSelection={active} bind:selectedRowIds {headers} {rows}>
		<Toolbar>
			<ToolbarBatchActions
				bind:active
				on:cancel={(e) => {
					e.preventDefault();
					active = false;
				}}
			>
				<Button
					icon={TrashCan}
					disabled={selectedRowIds.length === 0}
					on:click={() => {
						rows = rows.filter((row: any) => !selectedRowIds.includes(Number(row.id)));
						selectedRowIds = [];
					}}
				>
					Delete
				</Button>
			</ToolbarBatchActions>
			<ToolbarContent>
				<Button on:click={() => (active = true)}>Edit rows</Button>
			</ToolbarContent>
		</Toolbar>
	</DataTable>
	<!-- Once resolved, iterate over the 'classes' array -->
	{#each classes as classObject}
		{console.log(classObject)}
		<div class="class-card">
			<h2>{classObject.name}</h2>
			<p>{classObject.description}</p>
		</div>
	{/each}
	<!-- Optional: Handle case where classes array is empty -->
	{#if classes.length === 0}
		<p>No classes found.</p>
	{/if}
{:catch error}
	<!-- Optional: Show an error state -->
	<p style="color: red;">Error loading classes: {error.message}</p>
{/await}
