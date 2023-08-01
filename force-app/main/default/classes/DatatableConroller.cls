public with sharing class DatatableConroller {
 
    @AuraEnabled(cacheable=true)
	public static List<String> getObjects(String currentObjectName) {
        Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(currentObjectName).getDescribe();
        List<Schema.ChildRelationship> childRelationships = describeResult.getChildRelationships();

        Set<String> relatedObjectNames = new Set<String>();

        // Adding child object names
        for (Schema.ChildRelationship relationship : childRelationships) {
            relatedObjectNames.add(relationship.getChildSObject().getDescribe().getName());
        }

        // Adding parent object names
        Map<String, Schema.SObjectField> fieldsMap = describeResult.fields.getMap();
        for (Schema.SObjectField field : fieldsMap.values()) {
            Schema.DescribeFieldResult fieldDescribe = field.getDescribe();
            List<Schema.SObjectType> referenceToObjects = fieldDescribe.getReferenceTo();
            if (referenceToObjects != null && !referenceToObjects.isEmpty()) {
                relatedObjectNames.add(referenceToObjects[0].getDescribe().getName());
            }
        }

        List<String> listOfRelatedObjectNames = new List<String>(relatedObjectNames);
        listOfRelatedObjectNames.sort();

        return listOfRelatedObjectNames;
    }


    @AuraEnabled(cacheable=true)
	public static List<String> getObjectFields(String objectName) {
		Schema.DescribeSObjectResult describeResult = Schema.getGlobalDescribe().get(objectName).getDescribe();
        List<String> fieldNames = new List<String>();

		List<Schema.SObjectField> fields = describeResult.fields.getMap().values();
		for(Schema.SObjectField field : fields) {
			fieldNames.add(field.getDescribe().getName());
		}
        
        fieldNames.sort();
        return fieldNames;
    }


    @AuraEnabled(cacheable=true)
	public static List<SObject> fetchData(List<String> fieldNames, String selectedObjectApiName, String currentObjectApiName, String recordId) {
        List<SObject> relatedRecords = new List<SObject>();
        
        SObjectType objectType = Schema.getGlobalDescribe().get(selectedObjectApiName);
        if (objectType != null) {
            SObjectType accountType = Schema.getGlobalDescribe().get(currentObjectApiName);
            Schema.DescribeSObjectResult accountDescribe = accountType.getDescribe();
            
            List<Schema.ChildRelationship> childRelationships = accountDescribe.getChildRelationships();
            
            for (Schema.ChildRelationship relationship : childRelationships) {
                String selectedObjectApiNameFromRelationship = relationship.getChildSObject().getDescribe().getName();
                if (selectedObjectApiNameFromRelationship == selectedObjectApiName) {
                    String relatedFieldName = relationship.getField().getDescribe().getName();
                    String soqlQuery = 'SELECT ' + String.join(fieldNames, ',') + ' FROM ' + selectedObjectApiName + ' WHERE ' + relatedFieldName + ' = :recordId'; 
                    relatedRecords = Database.query(soqlQuery);
                    break;
                }
            }
        }
        
        return relatedRecords;
    }

}