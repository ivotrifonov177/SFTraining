import { LightningElement, wire, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getContact from '@salesforce/apex/ContactController.getContact';
import updateContact from '@salesforce/apex/ContactController.updateContact';

export default class ContactEditor extends LightningElement {
    @api recordId;
    contact;

    @wire(getContact, { contactId: '$recordId' })
    wiredContact({ data, error }) {
        if (data) {
            this.contact = { ...data };
        } else if (error) {
            this.showToast('Error', 'Failed to load contact', 'error');
        }
    }

    handleChange(e) {
        const field = e.target.dataset.field;
        this.contact[field] = e.target.value;
    }

    async handleSave() {
        try {
            await updateContact({ c: this.contact });
            this.showToast('Success', 'Contact updated successfully', 'success');
        } catch (error) {
            this.showToast('Error', error.body?.message, 'error');
        }
    }

    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}