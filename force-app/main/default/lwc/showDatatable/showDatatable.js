import { LightningElement, api, wire } from 'lwc';
import { getObjectInfo } from 'lightning/uiObjectInfoApi';
import { CurrentPageReference } from 'lightning/navigation';
import fetchData from '@salesforce/apex/DatatableConroller.fetchData';

export default class ShowDatatable extends LightningElement {
    @api checkedFieldNames;
    @api selectedObjectName;
    columns = [];
    data = [];
    recordId;

    @wire(getObjectInfo, { objectApiName: '$selectedObjectName' })
    objectInfo;

    @wire(CurrentPageReference) pageRef;

    connectedCallback() {
        this.checkedFieldNames = JSON.parse(this.checkedFieldNames);
        this.recordId = this.pageRef.attributes.recordId;
        
    }

    @wire(fetchData, {fieldNames: '$checkedFieldNames', objectApiName:'$selectedObjectName', recordId: '$recordId'})
    getDataForDatatable({data, error}){ 
        if(data){ 
            console.log('data==', JSON.stringify(data));
            this.data = data;
        }
        if(error){ 
            console.log(error);
        }
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