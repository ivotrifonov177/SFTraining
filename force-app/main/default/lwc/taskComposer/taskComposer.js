import { LightningElement, api, wire } from 'lwc';
import createTask from '@salesforce/apex/ContactWorkspaceController.createTask';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { publish, MessageContext } from 'lightning/messageService';
import TASK_EVENTS from '@salesforce/messageChannel/TaskEvents__c';

export default class TaskComposer extends LightningElement {
    @api recordId;
    subject = '';
    isDisabled = true;
    date;

    @wire(MessageContext) messageContext;

    handleChange(e) {
        const f = e.target.dataset.field;
        this[f] = e.target.value;
        
        if (this.date) {
            this.isDisabled = false;
        }
    }

    async handleCreate() {
        if (!this.recordId) return;
        try {
            const task = await createTask({ whoId: this.recordId, subject: this.subject || 'Follow up', activityDate: this.date });
            this.dispatchEvent(new ShowToastEvent({ title: 'Created', message: 'Task Created', variant: 'success' }));
            publish(this.messageContext, TASK_EVENTS, { whoId: this.recordId, taskId: task.Id })
            this.subject = '';
            this.date = null;
            this.isDisabled = true;
        } catch (error) {
            this.dispatchEvent(new ShowToastEvent({ title: 'Error', message: e?.body?.message || 'Failed', variant: 'error' }));
        }
    }
}