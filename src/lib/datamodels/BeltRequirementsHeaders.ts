import { type DataTableHeader } from '$lib/datamodels/DataTableHeaders.js';

export const BeltRequirementsHeaders:
  DataTableHeader<{
    id: number;
    beltName: string;
    requirementName: string;
    description: string;
  }>[] = [
    { key: 'id', value: 'ID' },
    { key: 'beltName', value: 'Belt Name' },
    { key: 'requirementName', value: 'Requirement Name' },
    { key: 'description', value: 'Description' }
  ];