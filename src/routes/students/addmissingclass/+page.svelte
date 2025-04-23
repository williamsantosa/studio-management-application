<script lang="ts">
	// Base Carbon Styling
	import 'carbon-components-svelte/css/all.css';

	// Carbon Component Imports
	import { Button, Grid, Row, Column, Dropdown, Table, TableHead, TableBody, TableCell, TableRow, TableHeader } from 'carbon-components-svelte';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';
	import { getClassesStartingOn, addClassToStudent } from '$lib/pocketbase.js';
    import { AddClassHeaders } from '$lib/datamodels/AddClassHeaders.js';

	// --- Types ---
	interface CalendarDay {
		date: Date;
		dayOfMonth: number;
		isCurrentMonth: boolean;
		isToday: boolean;
		isWeekend: boolean;
	}

	interface CalendarWeek {
		weekNumber: number; // Optional: could add week number calculation
		days: CalendarDay[];
	}

    // --- Variables ---
    let { data } = $props(); // Data passed from the parent component

    let currentDate = $state(new Date()); // Current date for event handling
    let todayClasses: any = $state( data.todayClasses || []); // Classes for today
    let rows: any = $derived(
        todayClasses.map((classObject: any) => ({
            id: classObject.id,
            name: classObject.name,
            description: classObject.description,
            schedule: classObject.schedule,
			startTime: classObject.startTime,
			endTime: classObject.endTime,
            addButton: {
                classId: classObject.id,
                text: 'Add',
                onClick: () => addClassToStudentClick(classObject.studentId, classObject.id),
            },
        }))
    );

    async function addClassToStudentClick(studentId: string, classId: string) {
        console.log(`Adding class ${classId} to student ${studentId}`);
        // Logic to add the class to the selected student
        // This could involve a POST request to your API or database
        try {
            await addClassToStudent(studentId, classId);
            console.log(`Class ${classId} added to student ${studentId}`);
            // Optionally refresh the classes or show a success message
        } catch (error) {
            console.error('Error adding class:', error);
            // Handle error (e.g., show an error message)
        }
    }

    let studentData: any = $state(data.students);
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

    let selectedId: string = $state(items[0]?.id || ''); // Default to the first item or empty string if no items
    let selectedStudent: any = $derived(items.find((item) => item.id === selectedId));
    $effect(() => {
        console.log('Selected student:', selectedStudent);
        $state.snapshot(`studentData: ${studentData.find(((item: any) => item.id === selectedId))}`);
        console.log(items);
    });

    const headers = AddClassHeaders.filter((header => header.key !== 'id')); // Filter out the 'id' column

	// --- State ---
    // Use the first day of the month for consistency
    function getFirstDayOfMonth(date: Date): Date {
        const d = new Date(date);
        d.setDate(1);
        d.setHours(0, 0, 0, 0); // Normalize time
        return d;
    }
	let displayedMonthDate = $state(getFirstDayOfMonth(new Date()));

	// --- Constants ---
	const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date for comparison

	// --- Derived State ---
	// Calculate the display label (Month Year)
	let monthYearLabel = $derived(
		displayedMonthDate.toLocaleDateString(undefined, {
			month: 'long',
			year: 'numeric'
		})
	);
    
    

	// Calculate the grid of weeks and days
	let calculateCalendarGrid: any = $derived(() => {
		const weeks: CalendarWeek[] = [];
		const year = displayedMonthDate.getFullYear();
		const month = displayedMonthDate.getMonth(); // 0-11

		// Day of the week the first day falls on (0=Sun, 1=Mon, ...)
		const firstDayOfMonthWeekday = displayedMonthDate.getDay();

		// Find the date of the Sunday that starts the first week shown on the calendar
        // (could be in the previous month)
		const startDate = new Date(displayedMonthDate);
		startDate.setDate(startDate.getDate() - firstDayOfMonthWeekday);

		let currentWeek: CalendarDay[] = [];
		let weekCount = 0;

		// Generate days for 6 weeks (typical max needed for a month grid)
		for (let i = 0; i < 42; i++) { // 6 weeks * 7 days
			const date = new Date(startDate);
			date.setDate(startDate.getDate() + i);
            date.setHours(0,0,0,0); // Normalize time

			const dayOfMonth = date.getDate();
			const isCurrentMonth = date.getMonth() === month && date.getFullYear() === year;
            const isToday = date.getTime() === currentDate.getTime();
            const dayOfWeek = date.getDay(); // 0=Sun, 6=Sat
            const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

			currentWeek.push({
				date,
				dayOfMonth,
				isCurrentMonth,
				isToday,
                isWeekend
			});

			// If we've reached the end of a week (Saturday) or the end of the loop
			if (currentWeek.length === 7) {
				weeks.push({ weekNumber: weekCount++, days: currentWeek });
				currentWeek = []; // Start a new week
			}
		}

		// Optional: Trim empty weeks from the end if the month only needs 4 or 5 weeks
		// For simplicity here, we always render 6 weeks.

		return weeks;
	});

    let calendarGrid = $derived(calculateCalendarGrid());

	// --- Functions ---
	function goToPrevMonth() {
        console.log(calendarGrid);
		const newDate = new Date(displayedMonthDate);
		newDate.setMonth(newDate.getMonth() - 1);
		displayedMonthDate = getFirstDayOfMonth(newDate); // Update state
	}

	function goToNextMonth() {
		const newDate = new Date(displayedMonthDate);
		newDate.setMonth(newDate.getMonth() + 1);
		displayedMonthDate = getFirstDayOfMonth(newDate); // Update state
	}

    async function handleDayClick(day: CalendarDay) {
        if (!day.isCurrentMonth) return; // Optional: prevent interaction with other month days
        console.log('Clicked on:', day.date.toLocaleDateString());
        currentDate = day.date;
        todayClasses = await getClassesStartingOn(formatDateToMMDDYYYY(currentDate));
    }

    function formatDateToMMDDYYYY(date: Date): string {
        const month = String(date.getMonth() + 1).padStart(2, '0'); // getMonth() is 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }
</script>

<Dropdown
	titleText="Student"
	bind:selectedId={selectedId}
	items={items}
	let:item
    style="margin-bottom: 1rem;"
>
	<div>
		<strong>{item.text}</strong>
	</div>
</Dropdown>

<Grid>
    <Row>
        <Column lg={5}>
            <h3 style="text-align: center; margin-top: 0.5rem;">Calendar</h3>
            <div class="calendar-container">
                <!-- Header and Navigation -->
                <Grid fullWidth>
                    <Row>
                        <Button kind="ghost" iconDescription="Previous month" icon={ChevronLeft} on:click={goToPrevMonth} aria-label="Previous month" />
                        <Button kind="ghost" iconDescription="Next month" icon={ChevronRight} on:click={goToNextMonth} aria-label="Next month" />
                        <Column lg={1}>
                            <h2 class="calendar-title" style="text-align: left; margin-top: 0.5rem;">{monthYearLabel}</h2>
                        </Column>
                    </Row>
                </Grid>
            
                <!-- Calendar Grid -->
                <table class="calendar-table">
                    <thead>
                        <tr>
                            {#each DAY_NAMES as dayName}
                                <th>{dayName}</th>
                            {/each}
                        </tr>
                    </thead>
                    <tbody>
                        {#each calendarGrid as week (week.weekNumber)}
                            <tr>
                                {#each week.days as day (day.date.toISOString())}
                                    <td
                                        class:other-month={!day.isCurrentMonth}
                                        class:today={day.isToday}
                                        class:weekend={day.isWeekend && day.isCurrentMonth}
                                        aria-label={day.date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        tabindex={day.isCurrentMonth ? 0 : -1}
                                        onclick={() => handleDayClick(day)}
                                        onkeydown={(e) => { if(e.key === 'Enter' || e.key === ' ') handleDayClick(day)}}
                                        role="button"
                                    >
                                        <span class="day-number">{day.dayOfMonth}</span>
                                        <!-- Add event rendering logic here if needed -->
                                    </td>
                                {/each}
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </Column>
        <Column lg={11}>
            <h3 style="text-align: center; margin-top: 0.5rem; margin-bottom: 1rem;">Schedule</h3>
            <Table>
                <TableHead>
                    <TableRow>
                        {#each headers as header}
                            <TableHeader>{header.value}</TableHeader>
                        {/each}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {#each rows as row (row.id)}
                        <TableRow>
                            {#each headers as header}
                                <TableCell>
                                    {#if header.key === 'addButton'}
                                        <Button
                                            kind="tertiary"
                                            on:click={() => addClassToStudentClick(selectedId, row.id)}>
                                        Add Class
                                        </Button>
                                    {:else}
                                        {row[header.key]}
                                    {/if}
                                </TableCell>
                            {/each}
                        </TableRow>
                    {/each}
                </TableBody>
            </Table>
        </Column>
    </Row>
</Grid>


<style>
	.calendar-container {
		max-width: 100%; /* Adjust as needed */
		margin: 1rem auto;
        border: 1px solid var(--cds-border-subtle, #e0e0e0); /* Carbon border token */
        border-radius: 4px;
        padding: 1rem;
        background-color: var(--cds-background, #fff);
	}

    .calendar-title {
        font-size: var(--cds-heading-03, 1.25rem); /* Carbon type token */
        font-weight: 600;
        margin: 0;
        text-align: center;
        /* Ensure title doesn't prevent buttons from being close */
        flex-grow: 1;
        min-width: 150px;
    }

	.calendar-table {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed; /* Equal column widths */
        margin-top: 0.5rem;
	}

	.calendar-table th {
        font-size: var(--cds-label-01, 0.75rem); /* Carbon type token */
		font-weight: 600;
		padding: 0.5rem 0.25rem;
		text-align: center;
		color: var(--cds-text-secondary, #525252);
        border-bottom: 1px solid var(--cds-border-subtle, #e0e0e0);
	}

	.calendar-table td {
		border: 1px solid var(--cds-border-subtle-00, #f4f4f4); /* Lighter border inside */
		padding: 0.5rem;
		text-align: center;
		vertical-align: top;
		height: 1rem;
        width: 1rem;
        font-size: var(--cds-body-short-01, 0.875rem);
        position: relative; /* For absolute positioning of 'today' marker */
        cursor: default; /* Default cursor */
	}

    /* Make current month days interactive */
    .calendar-table td:not(.other-month) {
         cursor: pointer;
    }
    .calendar-table td:not(.other-month):hover,
    .calendar-table td:not(.other-month):focus {
        background-color: var(--cds-background-hover, #e5e5e5);
        outline: 2px solid var(--cds-focus, #0f62fe);
        outline-offset: -2px;
    }

	.calendar-table td .day-number {
		display: inline-block;
        min-width: 1.75em; /* Ensure circle looks okay for single digits */
        padding: 0.2em;
        line-height: 1;
        border-radius: 50%;
	}

	.calendar-table td.other-month .day-number {
		color: var(--cds-text-disabled, #c6c6c6);
	}
    .calendar-table td.other-month {
        background-color: var(--cds-background-secondary, #f4f4f4);
    }

	.calendar-table td.today .day-number {
		background-color: var(--cds-interactive-01, #0f62fe); /* Carbon primary button color */
		color: var(--cds-text-on-color, #ffffff);
		font-weight: 600;
	}

	/* Basic Responsive */
	@media (max-width: 600px) {
		.calendar-container {
			padding: 0.5rem;
		}
        .calendar-title {
            font-size: var(--cds-heading-02, 1rem);
        }
		.calendar-table th {
			font-size: 0.65rem;
            padding: 0.4rem 0.1rem;
		}
        .calendar-table td {
            height: 60px;
            padding: 0.25rem;
            font-size: 0.75rem;
        }
	}
</style>