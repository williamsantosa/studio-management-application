<script lang='ts'>
	import { Dropdown } from 'carbon-components-svelte';
    let { data } = $props();

    let studentData = $state([
        {id: 'addStudent', name: 'Add Student'},
        ...data.students
    ]);
    let items: Array<{id: string, text: string}> = $derived(
        studentData.map((studentObject: any) => ({
            id: studentObject.id,
            text: studentObject.name
        }))
    );

    let selectedId: string = $state('addStudent');
</script>

<Dropdown
	titleText="Student"
	bind:selectedId={selectedId}
	items={items}
	let:item
	let:index
>
	<div>
		<strong>{item.text}</strong>
	</div>
</Dropdown>

<style>
	:global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
		height: auto;
	}
</style>

<h1>{selectedId}</h1>