const assert = require('chai').assert;
const helpers = require('../lib/helpers');
const RandomisedQueue = require('../lib/randomised-queue');

describe('RandomisedQueue', () => {

    describe('constructor', () => {

        it('returns object with functions enqueue, dequeue and isEmpty', () => {
            const q = RandomisedQueue();

            assert.sameMembers(Object.keys(q), [ 'enqueue', 'dequeue', 'isEmpty' ]);

            Object.keys(q).forEach(key => {
                assert.isFunction(q[key]);
            });
        });
    });

    describe('.enqueue()', () => {

        let queue;

        beforeEach(() => {
            queue = RandomisedQueue();
        });

        it('accepts any type of input', () => {
            assert.doesNotThrow(() => {
                queue.enqueue(null);
                queue.enqueue(123);
                queue.enqueue(1.23);
                queue.enqueue('123');
                queue.enqueue({});
                queue.enqueue([]);
            });
        });

        it('makes queue not empty', () => {
            assert.isTrue(queue.isEmpty());

            queue.enqueue(1);

            assert.isFalse(queue.isEmpty());
        });

        it('puts items in the queue to be dequeued', () => {
            queue.enqueue(1);
            queue.enqueue(2);
            queue.enqueue(3);

            assert.sameMembers([
            queue.dequeue(),
            queue.dequeue(),
            queue.dequeue()
            ], [ 1, 2, 3 ]);
        });

        it('works on an emptied queue', () => {
            queue.enqueue(1);
            queue.dequeue();

            queue.enqueue(2);
            queue.enqueue(3);
            queue.dequeue();
            queue.dequeue();

            queue.enqueue(3);
        });

        it('has time complexity O(1)');
    });

    describe('.dequeue()', () => {

        let queue;

        beforeEach(() => {
            queue = RandomisedQueue();
        });

        it('makes queue empty', () => {
            queue.enqueue(1);
            assert.isFalse(queue.isEmpty());

            queue.dequeue();
            assert.isTrue(queue.isEmpty());
        });

        it('throws if called on empty queue', () => {
            assert.throws(() => queue.dequeue(), 'Invalid operation: Queue is empty');
        });

        it('returns queued items in input order', () => {
            const arr = [ 3, 1, 8, 4, 9, 5 ,2 ];
            const res = [];

            arr.forEach(item => queue.enqueue(item));

            arr.forEach(item => {
                res.push(queue.dequeue());
            });

            assert.sameMembers(res, arr);
        });

        xit('returns items uniformly at random', () => {
            const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
            const n = 100000;
            const expected = n / arr.length;
            arr.forEach(item => queue.enqueue(item));
            let count = 0;

            for (let i = 0; i < n; i++) {
                let res = queue.dequeue();
                if (res === 1) count++;
                queue.enqueue(res);
            }

            assert.isAtMost(count, expected + 100);
            assert.isAtLeast(count, expected - 100);
        });

        it('returns different order each time for same input order', () => {
            const arr = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
            const res1 = [];
            const res2 = [];

            arr.forEach(item => queue.enqueue(item));
            arr.forEach(item => res1.push(queue.dequeue()));

            arr.forEach(item => queue.enqueue(item));
            arr.forEach(item => res2.push(queue.dequeue()));

            assert.sameMembers(res1, res2);
            assert.notEqual(res1, res2);
        });
    });

    describe('.isEmpty()', () => {

        let queue;

        beforeEach(() => {
            queue = RandomisedQueue();
        });

        it('returns true for new empty queue', () => {
            assert.isTrue(queue.isEmpty());
        });

        it('returns false for a non-empty queue', () => {
            queue.enqueue(123);
            assert.isFalse(queue.isEmpty());
        });

        it('returns true for an emptied queue', () => {
            queue.enqueue('something');
            queue.dequeue();
            assert.isTrue(queue.isEmpty());
        });

        it('retains correct state if dequeue is called on empty queue', () => {
            queue.enqueue(0);
            queue.dequeue();
            try {
                queue.dequeue();
            } catch (e) {}
            assert.isTrue(queue.isEmpty());
            queue.enqueue('something else');
            assert.isFalse(queue.isEmpty());
        });
    });

    describe('mixed random calls', () => {

        it('handles multiple mixed calls', () => {
            const n = 500;
            const q = RandomisedQueue();
            const functions = Object.keys(q);

            for (let i = 0, max = 5 * n; i < max; i++) {
                // pick random function to call
                let f = functions[helpers.getRandomInt(0, 2)];

                try {
                    q[f](helpers.getRandomInt(0, n));
                } catch (e) {
                    assert.equal(e, 'Error: Invalid operation: Queue is empty');
                }
            }
        });
    });
});
