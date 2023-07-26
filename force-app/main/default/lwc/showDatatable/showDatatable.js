import { LightningElement, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';

export default class ShowDatatable extends LightningElement {
    @api checkedFieldNames;
    @api selectedObjectName;

    connectedCallback() {
        this.checkedFieldNames = JSON.parse(this.checkedFieldNames);
        console.log('checkedFieldNames[1]='+this.checkedFieldNames[1]);
    }
}