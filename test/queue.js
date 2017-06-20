const assert = require('chai').assert;
const helpers = require('../lib/helpers');
const Queue = require('../lib/queue');

describe('Queue', () => {

    describe('constructor', () => {

        it('returns object with functions enqueue, dequeue and isEmpty', () => {
            const q = Queue();

            assert.sameMembers(Object.keys(q), [ 'enqueue', 'dequeue', 'isEmpty' ]);

            Object.keys(q).forEach(key => {
                assert.isFunction(q[key]);
            });
        });
    });

    describe('.enqueue()', () => {

        let queue;

        beforeEach(() => {
            queue = Queue();
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

            assert.equal(queue.dequeue(), 1);
            assert.equal(queue.dequeue(), 2);
            assert.equal(queue.dequeue(), 3);
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
            queue = Queue();
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

            arr.forEach(item => queue.enqueue(item));

            arr.forEach(item => {
                assert.equal(queue.dequeue(), item);
            });

        });
    });

    describe('.isEmpty()', () => {

        let queue;

        beforeEach(() => {
            queue = Queue();
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
            const q = Queue();
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
