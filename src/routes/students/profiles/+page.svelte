<script lang='ts'>
	import { 
        Dropdown,
        Grid,
        Row,
        Column,
        Form,
        FormGroup,
        TextInput,
        NumberInput,
        Button,
        FileUploader,
        FileUploaderItem,
     } from 'carbon-components-svelte';
     import { addStudent, getStudents } from '$lib/pocketbase';

    let { data } = $props();
    let fileUploader: FileUploader | null = $state(null);
    let studentData = $state([
        {id: 'addStudent', name: 'Add Student'},
        ...data.students
    ]);
    let items: Array<{
        id: string,
        text: string,
        dateOfBirth: string,
        email: string,
        phoneNumber: string,
        address: string,
        currentBelt: string,
        earnedBeltDate: string,
        profilePicture?: Array<File>,
    }> = $derived(
        studentData.map((studentObject: any) => ({
            id: studentObject.id,
            text: studentObject.name,
            dateOfBirth: studentObject.dateOfBirth,
            email: studentObject.email,
            phoneNumber: studentObject.phone,
            address: studentObject.address,
            currentBelt: studentObject.currentBelt,
            earnedBeltDate: studentObject.earnedBeltDate,
            profilePicture: studentObject.profilePicture,
        }))
    );

    // Foramts date to MM/DD/YYYY
    function formatDateToMMDDYYYY(dateObj: Date): string {
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();
        return `${month}/${day}/${year}`;
    }

    let addStudentFormVariables: any = $state({
        name: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
        address: '',
        currentBelt: 'White',
        earnedBeltDate: formatDateToMMDDYYYY(new Date()),
        profilePicture: null,
    });

    let selectedId: string = $state('addStudent');

    async function handleAddStudentSubmit(event: Event) {
        event.preventDefault();
        $state.snapshot(`addStudentFormVariables ${addStudentFormVariables}`);
        try {
            await addStudent(addStudentFormVariables);
            studentData = [
                {id: 'addStudent', name: 'Add Student'},
                ...(await getStudents())
            ];
            addStudentFormVariables = {
                name: '',
                dateOfBirth: '',
                email: '',
                phoneNumber: '',
                address: '',
                currentBelt: 'White',
                earnedBeltDate: formatDateToMMDDYYYY(new Date()),
                profilePicture: null,
            };
        } catch (error: any) {
            console.error('Error adding student:', error);
        } finally {
        }
    }
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

{#if selectedId === 'addStudent'}
<Grid fullWidth style="margin-top: 1.5rem;">
	<Form action="/classes/editclasses" method="POST" on:submit={handleAddStudentSubmit}>
		<FormGroup>
			<Row>
                <Column>
                    <TextInput bind:value={addStudentFormVariables.name} id="name" labelText="Name" placeholder="Enter name" required />
                </Column>
                <Column>
                    <TextInput bind:value={addStudentFormVariables.dateOfBirth} id="dateOfBirth" labelText="Date of Birth" placeholder="Enter date of birth" required />
                </Column>
                <Column>
                    <TextInput bind:value={addStudentFormVariables.email} id="email" labelText="Email" placeholder="Enter email" required />
                </Column>
                <Column>
                    <TextInput bind:value={addStudentFormVariables.phoneNumber} id="phoneNumber" labelText="Phone Number" placeholder="Enter phone number" required />
                </Column>
                <Column>
                    <TextInput bind:value={addStudentFormVariables.address} id="address" labelText="Address" placeholder="Enter address" required />
                </Column>
                <Column>
                    <Button style="margin-top: 1.5rem;" type="submit">Add Student</Button>
                </Column>
            </Row>
            <Row style="margin-top: 1rem;">
                <Column>
                    <FileUploader
                        bind:this={fileUploader}
                        bind:files={addStudentFormVariables.profilePicture}
                        id="profilePicture"
                        labelTitle="Profile Picture"
                        accept={['.jpg', '.png', '.jpeg']}
                        multiple={false}
                        name="profilePicture"
                        status="complete"
                        buttonLabel="Upload Profile Picture"
                    >
                    </FileUploader>
                </Column>
            </Row>
		</FormGroup>
	</Form>
</Grid>
{:else}
<h1>hey</h1>
{/if}


<style>
	:global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
		height: auto;
	}
</style>

