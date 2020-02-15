#include <iostream>
#include "Workers.h"
#include <mutex>

using namespace std;
int main() {
    mutex task_mutex;

    Workers worker_threads(4);
    Workers event_loop(1);
    worker_threads.start();
    event_loop.start();

    worker_threads.post([] {
        cout << "WORKERTHREADS TASK 1 running" << endl;
    });

    worker_threads.post([] {
        cout << "WORKERTHREADS TASK 2 running" << endl;
    });

    event_loop.post([] {
        cout << "EVENTLOOP Task 1 running" << endl;
    });

    event_loop.post([] {
        cout << "EVENTLOOP Task 2 running" << endl;
    });

    event_loop.post_timeout([] {
        cout << "EVENTLOOP Task 3 running" << endl;
    }, 2000);

    event_loop.post_timeout([] {
        cout << "EVENTLOOP Task 4 running" << endl;
    }, 100);

    worker_threads.stop();
    event_loop.stop();








    return 0;
}
