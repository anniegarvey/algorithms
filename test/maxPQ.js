const assert = require('chai').assert;

const helpers = require('../lib/helpers');
const MaxPQ = require('../lib/maxPQ');

describe('maxPQ',() => {

    describe('constructor', () => {

        it('returns object with functions insert, delMax and isEmpty', () => {
            const pq = MaxPQ();

            assert.sameMembers(Object.keys(pq), [ 'insert', 'delMax', 'isEmpty' ]);

            Object.keys(pq).forEach(key => {
                assert.isFunction(pq[key]);
            });
        });
    });

    describe('.insert()', () => {

        let pq;

        beforeEach(() => {
            pq = MaxPQ();
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

        it('puts items in the queue to be dequeued in descending order', () => {
            pq.insert(1);
            pq.insert(2);
            pq.insert(3);

            assert.equal(pq.delMax(), 3);
            assert.equal(pq.delMax(), 2);
            assert.equal(pq.delMax(), 1);
        });

        it('works on an emptied queue', () => {
            pq.insert(1);
            pq.delMax();

            pq.insert(2);
            pq.insert(3);
            pq.delMax();
            pq.delMax();

            pq.insert(3);
        });
    });

    describe('.delMax()', () => {

        let pq;

        beforeEach(() => {
            pq = MaxPQ();
        });

        it('makes queue empty', () => {
            pq.insert(1);
            assert.isFalse(pq.isEmpty());

            pq.delMax();
            assert.isTrue(pq.isEmpty());
        });

        it('throws if called on empty queue', () => {
            assert.throws(() => pq.delMax(), 'Invalid operation: Queue is empty');
        });

        describe('no priority function', () => {
            it('returns queued items in descending order', () => {
                const arr = [ 3, 1, 8, 4, 9, 5 ,2 ];

                arr.forEach(item => pq.insert(item));

                arr.sort((a, b) => b - a);
                arr.forEach(item => {
                    assert.equal(pq.delMax(), item);
                });
            });
        });

        describe('with priority function', () => {
            it('returns queued items in descending order of priority', () => {
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
                    return b.priority() - a.priority();
                });
                arr.forEach(item => {
                    assert.equal(pq.delMax(), item);
                });
            });
        });
    });

    describe('.isEmpty()', () => {

        let pq;

        beforeEach(() => {
            pq = MaxPQ();
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
            pq.delMax();
            assert.isTrue(pq.isEmpty());
        });

        it('retains correct state if dequeue is called on empty queue', () => {
            pq.insert(0);
            pq.delMax();
            try {
                pq.delMax();
            } catch (e) {}
            assert.isTrue(pq.isEmpty());
            pq.insert('something else');
            assert.isFalse(pq.isEmpty());
        });
    });

    describe('mixed random calls', () => {

        it('handles multiple mixed calls', () => {
            const n = 500;
            const pq = MaxPQ();
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
