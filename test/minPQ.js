const assert = require('chai').assert;

const helpers = require('../lib/helpers');
const MinPQ = require('../lib/minPQ');

describe('minPQ',() => {

    describe('constructor', () => {

        it('returns object with functions insert, delMin and isEmpty', () => {
            const pq = MinPQ();

            assert.sameMembers(Object.keys(pq), [ 'insert', 'delMin', 'isEmpty' ]);

            Object.keys(pq).forEach(key => {
                assert.isFunction(pq[key]);
            });
        });
    });

    describe('.insert()', () => {

        let pq;

        beforeEach(() => {
            pq = MinPQ();
        });

        it('accepts any type of input', () => {
            assert.doesNotThrow(() => {
                pq.insert(null);
                pq.insert(123);
                pq.insert(1.23);
                pq.insert('123');
                pq.insert({});
                pq.insert([]);
            });
        });

        it('makes queue not empty', () => {
            assert.isTrue(pq.isEmpty());
            pq.insert(1);
            assert.isFalse(pq.isEmpty());
        });

        it('puts items in the queue to be dequeued in ascending order', () => {
            pq.insert(1);
            pq.insert(2);
            pq.insert(3);

            assert.equal(pq.delMin(), 1);
            assert.equal(pq.delMin(), 2);
            assert.equal(pq.delMin(), 3);
        });

        it('works on an emptied queue', () => {
            pq.insert(1);
            pq.delMin();

            pq.insert(2);
            pq.insert(3);
            pq.delMin();
            pq.delMin();

            pq.insert(3);
        });
    });

    describe('.delMin()', () => {

        let pq;

        beforeEach(() => {
            pq = MinPQ();
        });

        it('makes queue empty', () => {
            pq.insert(1);
            assert.isFalse(pq.isEmpty());

            pq.delMin();
            assert.isTrue(pq.isEmpty());
        });

        it('throws if called on empty queue', () => {
            assert.throws(() => pq.delMin(), 'Invalid operation: Queue is empty');
        });

        describe('no priority function', () => {
            it('returns queued items in ascending order', () => {
                const arr = [ 3, 1, 8, 4, 9, 5 ,2 ];

                arr.forEach(item => pq.insert(item));

                arr.sort();
                arr.forEach(item => {
                    assert.equal(pq.delMin(), item);
                });
            });
        });

        describe('with priority function', () => {
            it('returns queued items in ascending order of priority', () => {
                const arr = [
                    { priority: () => 7 },
                    { priority: () => 1 },
                    { priority: () => -1 },
                    { priority: () => 5 },
                    { priority: () => 2 },
                    { priority: () => 0 }
                ];

                arr.forEach(item => pq.insert(item));

                arr.sort((a, b) => {
                    return a.priority() - b.priority();
                });
                arr.forEach(item => {
                    assert.equal(pq.delMin(), item);
                });
            });
        });
    });

    describe('.isEmpty()', () => {

        let pq;

        beforeEach(() => {
            pq = MinPQ();
        });

        it('returns true for new empty queue', () => {
            assert.isTrue(pq.isEmpty());
        });

        it('returns false for a non-empty queue', () => {
            pq.insert(123);
            assert.isFalse(pq.isEmpty());
        });

        it('returns true for an emptied queue', () => {
            pq.insert('something');
            pq.delMin();
            assert.isTrue(pq.isEmpty());
        });

        it('retains correct state if dequeue is called on empty queue', () => {
            pq.insert(0);
            pq.delMin();
            try {
                pq.delMin();
            } catch (e) {}
            assert.isTrue(pq.isEmpty());
            pq.insert('something else');
            assert.isFalse(pq.isEmpty());
        });
    });

    describe('mixed random calls', () => {

        it('handles multiple mixed calls', () => {
            const n = 500;
            const pq = MinPQ();
            const functions = Object.keys(pq);

            for (let i = 0, max = 5 * n; i < max; i++) {
                // pick random function to call
                let f = functions[helpers.getRandomInt(0, 2)];

                try {
                    pq[f](helpers.getRandomInt(0, n));
                } catch (e) {
                    assert.equal(e, 'Error: Invalid operation: Queue is empty');
                }
            }
        });
    });
});
