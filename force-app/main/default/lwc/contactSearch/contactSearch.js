import { LightningElement } from 'lwc';

export default class ContactSearch extends LightningElement {
    value = '';

    onChange(e) {
        this.value = e.target.value;
        this.dispatchEvent(new CustomEvent('search', { detail: { value: this.value } }));
    }
}