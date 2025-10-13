public with sharing class ContactController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String searchKey, Integer limitSize) {
        String key = (searchKey == null || searchKey.trim() == '') ? '' : '%' + searchKey.trim() + '%';
        Integer lim = (limitSize == null || limitSize <= 0) ? 50 : limitSize;

        return [
            SELECT Id, FirstName, LastName, Email, Account.Name
            FROM Contact
            WHERE (
                FirstName LIKE :key OR
                LastName  LIKE :key OR
                Email     LIKE :key
            )
            ORDER BY LastName NULLS LAST, FirstName NULLS LAST
            LIMIT :lim
        ];
    }

    @AuraEnabled
    public static Contact createContact(Contact c) {
        if (String.isBlank(c.LastName)) {
            throw new AuraHandledException('Last Name is required!');
        }

        insert c;
        return c;
    }

    @AuraEnabled
    public static void deleteContact(Id contactId) {
        delete [SELECT Id FROM Contact WHERE Id = :contactId];
    }

    @AuraEnabled(cacheable=true)
    public static Contact getContact(Id contactId) {
        return [
            SELECT Id, FirstName, LastName, Email, Phone
            FROM Contact
            WHERE Id = :contactId
            LIMIT 1
        ];
    }

    @AuraEnabled
    public static void updateContact(Contact c) {
        update c;
    }
}