import { type DataTableHeader } from '$lib/datamodels/DataTableHeaders.js';

export const InventoryHeaders:
  DataTableHeader<{
    id: number;
    name: string;
    quantity: number;
    sellPrice: number;
    vendor: string;
  }>[] = [
    { key: 'id', value: 'ID' },
    { key: 'name', value: 'Name' },
    { key: 'quantity', value: 'Quantity' },
    { key: 'sellPrice', value: 'Sell Price' },
    { key: 'vendor', value: 'Vendor' }
  ];