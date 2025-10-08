import { LightningElement, wire } from 'lwc';
import searchContacts from '@salesforce/apex/ContactController.searchContacts';
import createContact from '@salesforce/apex/ContactController.createContact';
import deleteContact from '@salesforce/apex/ContactController.deleteContact';

export default class ContactManager extends LightningElement {
    searchKey = ''
    isLoading = false;
    showModal = false;

    contacts = [];
    columns = [
        { label: 'Name', fieldName: 'Name' },
        { label: 'Email', fieldName: 'Email' },
        { label: 'Phone', fieldName: 'Phone' },
        { label: 'Account', fieldName: 'AccountName' },
        {
            type: 'action',
            typeAttributes: { rowActions: [{ label: 'Delete', name: 'delete' }] }
        }
    ];

    draft = { FirstName: '', LastName: '', Email: '', Phone: '' };

    @wire(searchContacts, { searchKey: '$searchKey', limitSize: 50 })
    wiredContacts({ data, error }) {
        if (data) {
            this.contacts = data.map(c => ({
                ...c,
                Name: `${c.FirstName || ''} ${c.LastName || ''}`.trim(),
                AccountName: c.Account ? c.Account.Name : ''
            }));
        } else if (error) {
            this.toast('Error', this.reduceErr(error), 'error');
        }
    }

    handleSearchChange(e) {
        this.searchKey = e.target.value;
    }

    openNew = () => { this.showModal = true };
    closeNew = () => {
        this.showModal = false;
        // reset draft
        this.draft = { FirstName:'', LastName:'', Email:'', Phone:'' };
    };

    handleDraft(e) {
        const field = e.target.dataset.field;
        this.draft = { ...this.draft, [field]: e.detail.value };
    }

    async create() {
        this.isLoading = true;
        try {
            await createContact({ c: this.draft });
            this.toast('Success', 'Contact created', 'success');
            this.closeNew();
            const k = this.searchKey;
            this.searchKey = k + ' '; // change value to retrigger
            setTimeout(() => (this.searchKey = k), 0);
        } catch (error) {
            this.toast('Error', this.reduceErr(e), 'error');
        } finally {
            this.isLoading = false;
        }
    }

    async handleRowAction(event) {
        if (event.detail.action.name === 'delete') {
            const id = event.detail.row.Id;
            this.isLoading = true;
            try {
                await deleteContact({ contactId: id });
                this.toast('Deleted', 'Contact removed', 'success');
                // soft refresh
                this.contacts = this.contacts.filter(c => c.Id !== id);
            } catch (error) {
                this.toast('Error', this.reduceErr(e), 'error');
            } finally {
                this.isLoading = false;
            }
        }
    }

    toast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }))
    }

    reduceErr(e) {
        return (e && e.body && (e.body.message || e.body.pageErrors?.[0]?.message)) || 'Unexpected error';
    }
}