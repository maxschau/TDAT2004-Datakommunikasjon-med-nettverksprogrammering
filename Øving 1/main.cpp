#include <iostream>
#include <thread>
#include <vector>
#include <mutex>
#include <list>
#include <cmath>
#include <queue>

using namespace std;

priority_queue<int> primes;
mutex primes_mutex;



bool isPrime(int a) {
    for (int i = 2; i < a; i++) {
        if (a % i == 0) {
            return false;
        }
    }
    return true;
}

void findPrimesBetween(int  from, int to, int limit) {
    for (int i = from; i <= to; ++i) {
        if (i <= limit) {
            if (isPrime(i)) {
                primes.push(i);
            }
        }
    }
}


priority_queue<int> findPrimes(int a, int b, int t) {
    vector<thread> ThreadVector;


    int factor = ceil(double(b-a) / t);
    int startNumber = a;
    int nextNumber = a+factor;


    for (int i = 0; i < t; i++) {
        ThreadVector.emplace_back([&startNumber, &nextNumber, &i, &factor, &b]{
            lock_guard<mutex> lock(primes_mutex);
            findPrimesBetween(startNumber, nextNumber, b);
            startNumber = nextNumber + 1;
            nextNumber += factor;
        });
    };
    for (int i = 0; i < ThreadVector.size(); ++i) {
        ThreadVector[i].join();
    }
    return primes;
}




int main() {
    priority_queue<int> res = findPrimes(1, 160, 140);
    cout << "List of primes: " << "\n";
    while (!res.empty())
    {
        cout << res.top() << endl;
        res.pop();
    }


}
