import { LightningElement } from 'lwc';

export default class ContactWorkspace extends LightningElement {
    searchKey = '';
    selectedId;

    handleSearch(event) {
        this.searchKey = event.detail?.value || '';
    }

    handleSelect(event) {
        this.selectedId = event.detail?.id;
    }
}