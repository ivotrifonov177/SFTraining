import { LightningElement, api, wire } from 'lwc';
import searchContacts from '@salesforce/apex/ContactWorkspaceController.searchContacts';

const COLS = [
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email' },
    { label: 'Phone', fieldName: 'Phone' },
    { label: 'Account', fieldName: 'AccountName' }
];

export default class ContactList extends LightningElement {
    @api searchKey = '';
    columns = COLS;
    rows = [];

    @wire(searchContacts, { searchKey: '$searchKey', limitSize: 20 })
    wired({ data, error }) {
        if (data) {
            this.rows = data.map(c => ({
                ...c,
                Name: `${c.FirstName || ''} ${c.LastName || ''}`.trim(),
                AccountName: c.Account ? c.Account.Name : ''
            }));
        } else if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    handleRowSelection(event) {
        const selected = event.detail.selectedRows || [];
        const id = selected.length ? selected[0].Id : null;
        if (id) this.dispatchEvent(new CustomEvent('select', { detail: { id } }));
    }
}