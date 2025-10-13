@isTest
private class ContactControllerTest {
    @TestSetup
    static void setupData() {
        Account a = new Account(Name = 'sForce');
        insert a;
        insert new Contact(FirstName='Jake', LastName='Llorrac', Email='jake@example.com',  Phone='555-1111', AccountId=a.Id);
        insert new Contact(FirstName='Siddartha', LastName='N',   Email='sid@example.com',   Phone='555-2222', AccountId=a.Id);
        insert new Contact(FirstName='Ana', LastName='Doe',       Email='ana@example.com',   Phone='555-3333', AccountId=a.Id);
    }

    @IsTest
    static void search_returns_when_key_matches() {
        Test.startTest();
        List<Contact> rows = ContactController.searchContacts('jake', 50);
        Test.stopTest();

        System.assertEquals(1, rows.size(), 'Should find only Jake by name/email');
        System.assertEquals('jake@example.com', rows[0].Email);
    }

    @IsTest
    static void search_blank_key_uses_fallback_branch() {
        Test.startTest();
        List<Contact> rows = ContactController.searchContacts(null, 50);
        Test.stopTest();

        System.assertEquals(3, rows.size(), 'Blank key should return default list');
    }

    @IsTest
    static void search_respects_limit() {
        Test.startTest();
        List<Contact> rows = ContactController.searchContacts('', 2);
        Test.stopTest();

        System.assertEquals(2, rows.size(), 'Limit should cap the result size');
    }

    @IsTest
    static void getContact_reads_single_record() {
        Contact anyContact = [SELECT Id FROM Contact LIMIT 1];

        Test.startTest();
        Contact c = ContactController.getContact(anyContact.Id);
        Test.stopTest();

        System.assertEquals(anyContact.Id, c.Id);
    }

    @IsTest
    static void createContact_success_and_required_validation() {
        // Success
        Contact toCreate = new Contact(LastName='New Person', Email='new@example.com');
        Test.startTest();
        Contact created = ContactController.createContact(toCreate);
        Test.stopTest();

        System.assertNotEquals(null, created.Id, 'Create should return inserted contact');

        // Required validation (LastName)
        Boolean threw = false;
        try {
            ContactController.createContact(new Contact(/* no LastName */));
        } catch (AuraHandledException e) {
            threw = true;
            System.assert(e.getMessage().contains('Last Name is required'));
        }
        System.assertEquals(true, threw, 'Missing LastName should throw AuraHandledException');
    }

    @IsTest
    static void updateContact_persists_changes() {
        Contact c = [SELECT Id, Phone FROM Contact WHERE Email = 'sid@example.com' LIMIT 1];
        c.Phone = '555-9999';

        Test.startTest();
        ContactController.updateContact(c);
        Test.stopTest();

        Contact fresh = [SELECT Phone FROM Contact WHERE Id = :c.Id];
        System.assertEquals('555-9999', fresh.Phone);
    }

    @IsTest
    static void deleteContact_removes_row() {
        Contact c = new Contact(LastName='Temp Delete');
        insert c;

        Test.startTest();
        ContactController.deleteContact(c.Id);
        Test.stopTest();

        System.assertEquals(0, [SELECT count() FROM Contact WHERE Id = :c.Id]);
    }
}