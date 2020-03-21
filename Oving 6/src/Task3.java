import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import java.util.concurrent.atomic.AtomicBoolean;

public class Task3 {
    public static void main(String[] args) {
        EntityManagerFactory emf = null;
        AccountDao accountDao = null;
        try {
            emf = Persistence.createEntityManagerFactory("accountEntity");
            accountDao = new AccountDao(emf);
            accountDao.deleteAll();

            System.out.println("\nDeleted all\n");

            Account from = new Account();
            from.setAccountnumber(10);
            from.setBalance(100);
            from.setOwner("Gunnar Pettersen");


            Account to = new Account();
            to.setAccountnumber(20);
            to.setBalance(20);
            to.setOwner("Anders Hansen");

            accountDao.addNewAccount(from);
            accountDao.addNewAccount(to);
            Runnable runnable = () -> {
                try {
                    System.out.println("Running thread " + Thread.currentThread().getName());
                    EntityManagerFactory emf1 = Persistence.createEntityManagerFactory("accountEntity");
                    AccountDao accountDao1 = new AccountDao(emf1);
                    int amount = 1;
                    from.withdraw(amount);
                    to.add(amount);

                    accountDao1.changeAccount(from);
                    accountDao1.changeAccount(to);

                    System.out.println("\nPrinting all accounts to verify that the change of money went through");
                    System.out.println(accountDao1.getAllAccounts());
                } catch (Exception e) {
                    e.printStackTrace();
                }
            };


            Thread thread1 = new Thread(runnable);
            Thread thread2 = new Thread(runnable);
            Thread thread3 = new Thread(runnable);
            thread1.start();
            thread2.start();
            thread3.start();


        } catch (
                Exception e) {
            e.printStackTrace();
        }

    }
}
