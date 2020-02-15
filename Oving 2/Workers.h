//
// Created by Max Schau on 14/02/2020.
//

#ifndef OVING_2_WORKERS_H
#define OVING_2_WORKERS_H

#include <thread>
#include <list>
#include <mutex>
#include <condition_variable>
#include <vector>

using namespace std;

class Workers {
    int amount;
    vector<thread> threads;
    mutex task_mutex;
    condition_variable cv;
    int counter;
    list<function<void()>> tasks;
    mutex done_mutex;
    bool done = false;


public:


    Workers(int amountInput) {
        counter = amountInput;
    }


    void start() {

        for (int i = 0; i < counter; i++) {
            function<void()> task;
            threads.emplace_back([this, &task] {
                while (true) {
                    function<void()> task;
                    {
                        unique_lock<mutex> ul(this->task_mutex);
                        this->cv.wait(ul, [this] {
                            return this->done || !this->tasks.empty();
                        });
                        if (this->tasks.empty() && this->done)
                            return;
                        task = *tasks.begin();
                        tasks.pop_front();
                    }
                    task();
                }
            });

        };



    }

    void stop() {
        {
            unique_lock<mutex> uniqueLock(this->done_mutex);
            done = true;
        }
        this->cv.notify_all();
        for (auto &t : this->threads) t.join();
        threads.empty();
    }


    void post(function<void()> f) {
        {
            unique_lock<mutex> uniqueLock(task_mutex);
            tasks.emplace_back(f);
        }
        cv.notify_one();
    };

    void post_timeout(function<void()> f, int ms) {
        this_thread::sleep_for(chrono::milliseconds(ms));
        {
            unique_lock<mutex> uniqueLock(task_mutex);
            tasks.emplace_back(f);
        }
        cv.notify_one();


    }

};

#endif //OVING_2_WORKERS_H
