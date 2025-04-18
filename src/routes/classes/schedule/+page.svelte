<script lang="ts">
	// Base Carbon Styling
	import 'carbon-components-svelte/css/all.css';

	// Carbon Component Imports
	import { Button, Grid, Row, Column } from 'carbon-components-svelte';
	import ChevronLeft from 'carbon-icons-svelte/lib/ChevronLeft.svelte';
	import ChevronRight from 'carbon-icons-svelte/lib/ChevronRight.svelte';

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

    // --- Props ---
    // You could make the initial date a prop if needed
    // let { initialDate = new Date() } = $props();

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
            const isToday = date.getTime() === today.getTime();
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

    function handleDayClick(day: CalendarDay) {
        if (!day.isCurrentMonth) return; // Optional: prevent interaction with other month days
        console.log('Clicked on:', day.date.toLocaleDateString());
        // You could emit an event or update some other state here
    }

</script>

<Grid>
    <Row>
        <Column lg={6}>
            <h3 style="text-align: center; margin-top: 0.5rem;">Select Date</h3>
            <div class="calendar-container">
                <!-- Header and Navigation -->
                <Grid fullWidth>
                    <Row>
                        <Column style="text-align: left;">
                            <Button kind="ghost" iconDescription="Previous month" icon={ChevronLeft} on:click={goToPrevMonth} aria-label="Previous month" />
                        </Column>
                        <Column>
                            <h2 class="calendar-title" style="text-align: center; margin-top: 0.5rem;">{monthYearLabel}</h2>
                        </Column>
                        <Column style="text-align: right;">
                            <Button kind="ghost" iconDescription="Next month" icon={ChevronRight} on:click={goToNextMonth} aria-label="Next month" />
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
        <Column lg={10}>
            <h3 style="text-align: center; margin-top: 0.5rem;">Schedule</h3>
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