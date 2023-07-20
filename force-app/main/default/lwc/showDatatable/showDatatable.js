import { LightningElement, wire } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class ShowDatatable extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    dataArray;

    connectedCallback() {
        if (this.pageRef && this.pageRef.state && this.pageRef.state.c__dataArray) {
            this.dataArray = JSON.parse(this.pageRef.state.c__dataArray);
        }


    }
}