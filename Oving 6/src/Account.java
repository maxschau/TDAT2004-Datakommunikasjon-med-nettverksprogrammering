import java.io.Serializable;
import javax.persistence.*;

import java.io.*;

//@Entity @NamedQuery(name="findAllAccounts", query="SELECT * from Account") //??
@Entity
public class Account implements Serializable {
    @Id
    private int accountnumber;

    private double balance;

    private String owner;

    @Version
    private int lockingfield;

    public Account(){};

    public Account(int accountnumber, String owner) {
        this.accountnumber = accountnumber;
        this.balance = 0;
        this.owner = owner;
    }

    public int getAccountnumber() {
        return accountnumber;
    }

    public double getBalance() {
        return balance;
    }

    public String getOwner() {
        return owner;
    }

    public void setAccountnumber(int accountnumber) {
        this.accountnumber = accountnumber;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public boolean withdraw(double amount) {
        if (amount <= 0) {
            return false;
        } else if (amount > balance) {
            return false;
        } else {
            balance -= amount;
            return true;
        }
    }

    public boolean add(double amount) {
        if (amount <= 0) {
            return false;
        } else {
            this.balance += amount;
            return true;
        }
    }

    @Override
    public String toString(){
        return "Accountnumber: " + accountnumber + "\n" + "Balance: " + balance + "\n" + "Owner: " + owner;
    }


}
