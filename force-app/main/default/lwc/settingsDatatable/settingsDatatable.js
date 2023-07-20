import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { CurrentPageReference } from 'lightning/navigation';
import getObjects from '@salesforce/apex/DatatableConroller.getObjects';
import getObjectFields from '@salesforce/apex/DatatableConroller.getObjectFields';

export default class SettingsDatatable extends NavigationMixin(LightningElement) {
    currentObjectApiName;
    objectNames = [];
    selectedObjectName;
    objectFieldsNames = [];
    checkedFieldNames = new Set();

    @wire(CurrentPageReference)
    getPageReference(currentPageReference) {
        if (currentPageReference) {
            this.currentObjectApiName = currentPageReference.attributes.objectApiName;
            this.getObjectsNames();
        }
    }

    getObjectsNames() {
        getObjects({ currentObjectName: this.currentObjectApiName })
            .then((result) => {
                this.objectNames = result.map((name) => ({ label: name, value: name }));
            })
            .catch((error) => {
                console.log('Error: ', error);
            });
    }

    hanldeObjectChanged(event) {
        this.selectedObjectName = event.target.value;
        
        getObjectFields({ objectName: this.selectedObjectName})
            .then((result) => {
                this.objectFieldsNames = result;
            }).catch(error => {
                console.log('Error: ', error.body.message);
        });
    }

    handleFieldCheckboxChanged(event) {
        if (event.target.checked) {
            this.checkedFieldNames.add(event.target.name);
        } else {
            this.checkedFieldNames.delete(event.target.name);
        }
    }

    clickButtonHandler() {
        console.log('this.checkedFieldNames==', this.checkedFieldNames);
        this.navigateToNextComponent();
    }

    navigateToNextComponent() {
        const checkedFieldNamesArray = Array.from(this.checkedFieldNames);

        this[NavigationMixin.Navigate]({
            type: 'standard__component',
            attributes: {
                componentName: 'c__showDatatableAura'
            },
            state: {
                c__dataArray: JSON.stringify(checkedFieldNamesArray)
            }
        });
    }


}