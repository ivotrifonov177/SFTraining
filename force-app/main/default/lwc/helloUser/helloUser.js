import { LightningElement } from 'lwc';

export default class HelloUser extends LightningElement {
    name = 'Ivo';
    handleChange(event) {
        this.name = event.target.value;
    }
}