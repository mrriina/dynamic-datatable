import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';

export default class ShowDatatable extends LightningElement {
    @api checkedFieldNames;
    @api selectedObjectName;
    columns = [];
    data = [];

    @wire(getObjectInfo, { objectApiName: '$selectedObjectName' })
    objectInfo;

    connectedCallback() {
        this.checkedFieldNames = JSON.parse(this.checkedFieldNames);
    }

    get columnsInfo() {
        if (this.objectInfo.data) {
            this.generateColumns();
        }
        return this.columns;
    }


    generateColumns() {
        if (this.objectInfo.data) {
            const fields = this.objectInfo.data.fields;
            this.checkedFieldNames.forEach((fieldName) => {
                const field = fields[fieldName];
                if (field) {
                    this.columns.push({
                        label: field.label,
                        fieldName: field.apiName
                    });
                }
            });
        }
    }
}