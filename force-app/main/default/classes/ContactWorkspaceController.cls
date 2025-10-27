public with sharing class ContactWorkspaceController {
    @AuraEnabled(cacheable=true)
    public static List<Contact> searchContacts(String searchKey, Integer limitSize) {
        Boolean hasKey = !String.isBlank(searchKey);
        String key = hasKey ? '%' + searchKey.trim() + '%' : null;
        Integer lim = (limitSize == null || limitSize <= 0) ? 20 : Math.min(limitSize, 100);

        String base = 'SELECT Id, FirstName, LastName, Email, Phone, Account.Name FROM Contact';

        if (hasKey) {
            return Database.query(
                base + ' WHERE FirstName LIKE :key OR LastName LIKE :key OR Email LIKE :key ' +
                ' ORDER BY LastName NULLS LAST, FirstName NULLS LAST ' +
                ' LIMIT :lim'
            );
        }

        return Database.query(base + ' ORDER BY CreatedDate DESC LIMIT :lim');
    }

    @AuraEnabled
    public static List<Task> getRecentTasks(Id whoId, Integer limitSize) {
        if (whoId == null) return new List<Task>();
        Integer lim = (limitSize == null || limitSize <= 0) ? 10 : Math.min(limitSize, 50);
        return [
            SELECT Id, Subject, Status, ActivityDate, CreatedDate
            FROM Task
            WHERE WhoId = :whoId
            ORDER BY CreatedDate DESC
            LIMIT :lim
        ];
    }

    @AuraEnabled
    public static Task createTask(Id whoId, String subject, Date activityDate) {
        if (whoId == null) throw new AuraHandledException('Select a contact first!');
        Task t = new Task(whoId = whoId, Subject = subject, ActivityDate = activityDate);
        insert t;
        return t;
    }
}