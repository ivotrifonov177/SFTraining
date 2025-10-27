import { LightningElement, api, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import FIRST from '@salesforce/schema/Contact.FirstName';
import LAST from '@salesforce/schema/Contact.LastName';
import EMAIL from '@salesforce/schema/Contact.Email';
import PHONE from '@salesforce/schema/Contact.Phone';
import ACCOUNT from '@salesforce/schema/Contact.Account.Name';

export default class ContactSummary extends LightningElement {
    @api recordId;

    @wire(getRecord, { recordId: '$recordId', fields: [FIRST, LAST, EMAIL, PHONE, ACCOUNT] })
    contact;

    get name() {
        const first = getFieldValue(this.contact.data, FIRST) || '';
        const last = getFieldValue(this.contact.data, LAST) || '';
        return `${first} ${last}`.trim();
    }

    get email() { return getFieldValue(this.contact.data, EMAIL); }
    get phone() { return getFieldValue(this.contact.data, PHONE); }
    get accountName() { return getFieldValue(this.contact.data, ACCOUNT); }
}