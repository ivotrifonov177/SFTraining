import { LightningElement, api } from 'lwc';
import getContact from '@salesforce/apex/ContactController.getContact';

export default class ContactCard extends LightningElement {
    _contactId;
    contact;

    @api
    get contactId() { return this._contactId; }
    set contactId(value) {
        this._contactId = value;
        if (value) this.fetchContact();
    }

    async fetchContact() {
        try {
            this.contact = await getContact({ contactId: this._contactId });
        } catch (e) {
            console.error('Fetch failed', e);
        }
    }

    get hasContact() {
        return this.contact != null;
    }
}