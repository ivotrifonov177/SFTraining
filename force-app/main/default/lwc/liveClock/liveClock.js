import { LightningElement } from 'lwc';

export default class LiveClock extends LightningElement {
    time = '';
    intervalId;
    hasRendered = false;

    constructor() {
        super();
        this.time = this._formatTime();
    }

    _formatTime() {
        return new Date().toLocaleTimeString();
    }

    connectedCallback() {
        this.intervalId = setInterval(() => {
            this.time = this._formatTime();
        }, 1000);
    }

    renderedCallback() {
        if (this.hasRendered) return;
        this.hasRendered = true;

        // Highlight the card once on first render
        this.template.querySelector('.time')?.classList.add('slds-theme_success');
    }

    disconnectedCallback() {
        clearInterval(this.intervalId);
    }
}