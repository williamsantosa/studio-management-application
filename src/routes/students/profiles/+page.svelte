<script lang='ts'>
	import { 
        Dropdown,
        Grid,
        Row,
        Column,
        Form,
        FormGroup,
        TextInput,
        Button,
        FileUploader,
        DatePicker,
        DatePickerInput,
     } from 'carbon-components-svelte';
     import { addStudent, editStudent, getStudents, pb } from '$lib/pocketbase';

    let { data } = $props();
    let fileUploader: FileUploader | null = $state(null);
    let fileUploaderEdit: FileUploader | null = $state(null);
    let studentData: any = $state([
        {id: 'addStudent', name: 'Add Student', dateOfBirth: '', email: '', phoneNumber: '', address: '', currentBelt: 'White', earnedBeltDate: '', profilePicture: null},
        {id: 'editStudent', name: 'Edit Student', dateOfBirth: '', email: '', phoneNumber: '', address: '', currentBelt: 'White', earnedBeltDate: '', profilePicture: null},
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
            phoneNumber: studentObject.phoneNumber,
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

    let selectedEditId: string = $state(items.find(i => i.id !== 'addStudent' && i.id !== 'editStudent')?.id ?? '');
    let editStudentFormVariables: any = $state({
        name: '',
        dateOfBirth: '',
        email: '',
        phoneNumber: '',
        address: '',
        currentBelt: 'White',
        earnedBeltDate: formatDateToMMDDYYYY(new Date()),
        profilePicture: [],
    });

    let selectedId: string = $state('addStudent');
    let selectedStudent: any = $derived(items.find((item) => item.id === selectedId));
    $effect(() => {
        console.log('Selected student:', selectedStudent);
        $state.snapshot(`studentData: ${studentData.find(((item: any) => item.id === selectedId))}`);
        console.log(items);
    });

    async function handleAddStudentSubmit(event: Event) {
        event.preventDefault();
        $state.snapshot(`addStudentFormVariables ${addStudentFormVariables}`);
        try {
            await addStudent(addStudentFormVariables);
            studentData = [
                {id: 'addStudent', name: 'Add Student', dateOfBirth: '', email: '', phoneNumber: '', address: '', currentBelt: 'White', earnedBeltDate: '', profilePicture: null},
                {id: 'editStudent', name: 'Edit Student', dateOfBirth: '', email: '', phoneNumber: '', address: '', currentBelt: 'White', earnedBeltDate: '', profilePicture: null},
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
                profilePicture: [],
            };
        } catch (error: any) {
            console.error('Error adding student:', error);
        } finally {
        }
    }

    async function handleEditStudentSubmit(event: Event) {
        event.preventDefault();
        $state.snapshot(`editStudentFormVariables ${editStudentFormVariables}`);
        try {
            await editStudent(editStudentFormVariables.id, editStudentFormVariables);
            studentData = [
                {id: 'addStudent', name: 'Add Student', dateOfBirth: '', email: '', phoneNumber: '', address: '', currentBelt: 'White', earnedBeltDate: '', profilePicture: null},
                {id: 'editStudent', name: 'Edit Student', dateOfBirth: '', email: '', phoneNumber: '', address: '', currentBelt: 'White', earnedBeltDate: '', profilePicture: null},
                ...(await getStudents())
            ];
            editStudentFormVariables = {
                name: '',
                dateOfBirth: '',
                email: '',
                phoneNumber: '',
                address: '',
                currentBelt: 'White',
                earnedBeltDate: formatDateToMMDDYYYY(new Date()),
                profilePicture: [],
            };
        } catch (error: any) {
            console.error('Error editing student:', error);
        } finally {
        }
    }
</script>

<Dropdown
	titleText="Profile"
	bind:selectedId={selectedId}
	items={items}
	let:item
>
	<div>
		<strong>{item.text}</strong>
	</div>
</Dropdown>

{#if selectedId === 'editStudent'}
<Dropdown
    titleText="Student"
    bind:selectedId={selectedEditId}
    items={items.filter((item) => item.id !== 'addStudent' && item.id !== 'editStudent')}
    let:item
    style="margin-top: 1.5rem;"
    on:select={(e) => {
        selectedEditId = e.detail.selectedItem.id;
        editStudentFormVariables = items.find((item) => item.id === selectedEditId) || {
            name: '',
            dateOfBirth: '',
            email: '',
            phoneNumber: '',
            address: '',
            currentBelt: 'White',
            earnedBeltDate: formatDateToMMDDYYYY(new Date()),
            profilePicture: undefined,
        };
        editStudentFormVariables.name = items.find((item) => item.id === selectedEditId)?.text;
        editStudentFormVariables.profilePicture = undefined;
    }}
    >
    <div>
        <strong>{item.text}</strong>
    </div>
</Dropdown>
{/if}

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
{:else if selectedId === 'editStudent'}
<Grid fullWidth style="margin-top: 1.5rem;">
	<Form action="/classes/editclasses" method="POST" on:submit={handleEditStudentSubmit}>
		<FormGroup>
			<Row>
                <Column>
                    <TextInput bind:value={editStudentFormVariables.name} id="name" labelText="Name" placeholder="Enter name" required />
                </Column>
                <Column>
                    <TextInput bind:value={editStudentFormVariables.dateOfBirth} id="dateOfBirth" labelText="Date of Birth" placeholder="Enter date of birth" required />
                </Column>
                <Column>
                    <TextInput bind:value={editStudentFormVariables.email} id="email" labelText="Email" placeholder="Enter email" required />
                </Column>
                <Column>
                    <TextInput bind:value={editStudentFormVariables.phoneNumber} id="phoneNumber" labelText="Phone Number" placeholder="Enter phone number" required />
                </Column>
                <Column>
                    <TextInput bind:value={editStudentFormVariables.address} id="address" labelText="Address" placeholder="Enter address" required />
                </Column>
                <Column>
                    <Button style="margin-top: 1.5rem;" type="submit">Edit Student</Button>
                </Column>
            </Row>
            <Row style="margin-top: 1rem;">
                <Column>
                    <TextInput bind:value={editStudentFormVariables.currentBelt} id="currentBelt" labelText="Current Belt" placeholder="Enter current belt" required />
                </Column>
                <Column>
                    <DatePicker datePickerType="single" bind:value={editStudentFormVariables.earnedBeltDate}>
                        <DatePickerInput id="earnedBeltDate" placeholder="mm/dd/yyyy" labelText="Earned Belt Date"  />
                    </DatePicker>
                </Column>
                <Column>
                    <FileUploader
                        bind:this={fileUploaderEdit}
                        bind:files={editStudentFormVariables.profilePicture}
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
<h1 style="margin-top: 1rem">{selectedStudent.text}</h1>
<p style="margin-top: 1rem">Date of Birth: {selectedStudent.dateOfBirth}</p>
<p style="margin-top: 1rem">Email: {selectedStudent.email}</p>
<p style="margin-top: 1rem">Phone Number: {selectedStudent.phoneNumber}</p>
<p style="margin-top: 1rem">Address: {selectedStudent.address}</p>
<p style="margin-top: 1rem">Current Belt: {selectedStudent.currentBelt}</p>
<p style="margin-top: 1rem">Earned Belt Date: {selectedStudent.earnedBeltDate}</p>
{#if selectedStudent.profilePicture && selectedStudent.profilePicture.length > 0}
    <img 
    src={pb.files.getURL(
        studentData.find((s: any) => s.id === selectedStudent.id),
        selectedStudent.profilePicture
        )}
    alt=""
    style="margin-top: 1rem; width: 100px; height: 100px;" 
    />
{:else}
    <p style="margin-top: 1rem">No profile picture available</p>
{/if}
{/if}
<style>
	:global(.bx--list-box__menu-item, .bx--list-box__menu-item__option) {
		height: auto;
	}
</style>

