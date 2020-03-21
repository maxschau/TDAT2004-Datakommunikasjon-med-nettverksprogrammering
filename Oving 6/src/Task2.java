
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;


public class Task2 {
    public static void main(String[] args) {
        EntityManagerFactory emf = null;
        AccountDao accountDao = null;
        try {
            emf = Persistence.createEntityManagerFactory("accountEntity");
            accountDao = new AccountDao(emf);

            accountDao.deleteAll();
            //Task 2
            Account acc1 = new Account();
            acc1.setAccountnumber(123);
            acc1.setOwner("Max T. Schau");
            acc1.setBalance(900000);
            accountDao.addNewAccount(acc1);
            System.out.println("\nAdded account 1");

            Account acc2 = new Account();
            acc2.setAccountnumber(999);
            acc2.setOwner("Simon Årdal");
            acc2.setBalance(1000);
            accountDao.addNewAccount(acc2);
            System.out.println("\nAdded account 2");

            System.out.println("\nPrinting all accounts:");
            System.out.println(accountDao.getAllAccounts());

            System.out.println("\nPrinting all acounts with balance higher than 10kr");
            System.out.println(accountDao.getAllAccounts(2000.0));

            System.out.println("\nChanging the owner of accounts 2");
            acc2.setOwner("Simen Kjørstad");
            accountDao.changeAccount(acc2);

            System.out.println("\nPrinting all accounts to verify that the change went through");
            System.out.println(accountDao.getAllAccounts());




        }catch(Exception e) {
            e.printStackTrace();
        } finally {
            assert emf != null;
            emf.close();
        }
    }
}
