<script lang="ts">
	import { getClasses } from '$lib/pocketbase';
    let { data } = $props();

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

    let pageSize = $state(10);
    let page = $state(1);

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





<h3 style="display: block; margin-top: 1rem; margin-bottom: 1rem; text-align: center; ">Classes</h3>

<DataTable selectable batchSelection={active} bind:selectedRowIds {headers} {rows} {pageSize} {page}>
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
                on:click={() => {
                    rows = rows.filter((row: any) => !selectedRowIds.includes(Number(row.id)));
                    selectedRowIds = [];
                }}
            >
                Delete
            </Button>
        </ToolbarBatchActions>
        <ToolbarContent>
            <Button on:click={() => (active = true)}>Delete/Edit Row(s)</Button>
        </ToolbarContent>
    </Toolbar>
</DataTable>

<Pagination
  bind:pageSize
  bind:page
  totalItems={data.summaries.length}
  pageSizeInputDisabled
/> 

<h3 style="display: block; margin-top: 1rem; margin-bottom: 1rem; text-align: center; ">Add Class</h3>

<Grid fullWidth>
    <Form action="/classes/editclasses" method="POST">
        <FormGroup>
            <Row>
            {#each headers.filter(h => h.key !== 'id') as header}
                <Column>
                <TextInput id={header.key} labelText={header.value} name={header.key} required />
                </Column>
            {/each}
            </Row>
        </FormGroup>
        <Button type="submit">Add Class</Button>
    </Form>
</Grid>