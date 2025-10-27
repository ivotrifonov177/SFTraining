import { LightningElement, api, wire } from 'lwc';
import getRecentTasks from '@salesforce/apex/ContactWorkspaceController.getRecentTasks';
import { subscribe, MessageContext } from 'lightning/messageService';
import TASK_EVENTS from '@salesforce/messageChannel/TaskEvents__c';

export default class TaskList extends LightningElement {
    @api recordId;
    rows = [];

    @wire(MessageContext) messageContext;

    @wire(getRecentTasks, { whoId: '$recordId', limitSize: 10 })
    wired({ data, error }) {
        if (data) {
            this.rows = data;
        } else if (error) {
            // eslint-disable-next-line no-console
            console.error(error);
            this.rows = [];
        }
    }

    get hasRows() {
        return this.rows && this.rows.length > 0;
    }

    connectedCallback() {
        subscribe(this.messageContext, TASK_EVENTS, (m) => {
            if (m?.whoId === this.recordId) {
                this.refresh();
            }
        });
    }

    refresh() {
        // re-run the wire by nudging the parameter
        const id = this.recordId;
        this.recordId = null;
        setTimeout(() => { this.recordId = id; }, 0);
    }
}