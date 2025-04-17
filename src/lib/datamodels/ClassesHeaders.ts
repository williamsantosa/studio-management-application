import { type DataTableHeader } from '$lib/datamodels/DataTableHeaders.js';

export const ClassesHeaders:
  DataTableHeader<{
    id: number;
    name: string;
    description: string;
    schedule: string;
    startTime: string;
    endTime: string;
  }>[] = [
    { key: 'id', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'description', value: 'Description' },
    { key: 'schedule', value: 'Schedule' },
    { key: 'startTime', value: 'StartTime' },
    { key: 'endTime', value: 'EndTime' }
  ];