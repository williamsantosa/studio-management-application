import { type DataTableHeader } from '$lib/datamodels/DataTableHeaders.js';

export const AddClassHeaders:
  DataTableHeader<{
    id: number;
    name: string;
    description: string;
    day: string;
    startTime: string;
    endTime: string;
    addButton?: string;
  }>[] = [
    { key: 'id', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'description', value: 'Description' },
    { key: 'day', value: 'Day' },
    { key: 'startTime', value: 'StartTime' },
    { key: 'endTime', value: 'EndTime' },
    { key: 'addButton', value: 'Add Class' }
  ];