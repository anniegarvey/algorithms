const assert = require('chai').assert;
const helpers = require('../lib/helpers');
const UnionFind = require('../lib/union-find');

describe('UnionFind', () => {
    
    const magnitudes = [
            1,
            10,
            100,
            1000,
            10000,
            100000,
            1000000
		];
	
	describe('construction', () => {
        
		it('returns object with functions union and find', () => {
            const uf = UnionFind(1);
            
            assert.sameMembers(Object.keys(uf), [ 'union', 'connected' ]);
            
            Object.keys(uf).forEach(key => {
                assert.isFunction(uf[key]);
            });
        });
        
        it('throws if missing input size n', () => {
            assert.throws(() => UnionFind(), 'Missing size parameter');
        });
		
		magnitudes.forEach(n => {
			it(`does not throw for n = ${n}`, () => {
                assert.doesNotThrow(() => UnionFind(n));
            });
		});

        magnitudes.forEach((mag1, i) => {
            for (let j = i + 1; j < magnitudes.length; j++) {
                let mag2 = magnitudes[j];
                
                it(`has time complexity O(n): ${mag1} ${mag2}`, () => {
                    t1 = averageTime(() => UnionFind(mag1));
                    t2 = averageTime(() => UnionFind(mag2));
                    
                    assert.isBelow(t2 / t1, 3 * (mag2 / mag1)); // is 3 an acceptably low multiplier? don't really think so...
                });
            }            
        });
	});
    
    describe('.union()', () => {
        
        let uf;
        
        beforeEach(() => {
            uf = UnionFind(5);
        });
        
        it('connects two points', () => {
            const a = 1;
            const b = 3;
            
            assert.isFalse(uf.connected(a, b));
            
            uf.union(a, b);
            
            assert.isTrue(uf.connected(a, b));
        });
        
        it('is idempotent', () => {
            const a = 0;
            const b = 4;
            
            uf.union(a, b);
            uf.union(a, b);
            
            assert.isTrue(uf.connected(a, b));
        });
        
        it('throws if missing inputs', () => {
            assert.throws(() => uf.union(), 'union requires two integer parameters');
            assert.throws(() => uf.union(1), 'union requires two integer parameters');
            assert.throws(() => uf.union(undefined, 2), 'union requires two integer parameters');
        });
        
        it('throws if passed non-integer parameters', () => {
            assert.throws(() => uf.union('1', '2'), 'union requires two integer parameters');
        });
        
        // only worthwhile doing on at least partially connected set - need some setup
        it(`has time complexity O(lg*n)`);
    });
    
    describe('.connected()', () => {
        
        let uf;
        
        beforeEach(() => {
            uf = UnionFind(5);
        });
        
        it('returns false if points are not connected', () => {
            assert.isFalse(uf.connected(0, 1));
        });
        
        it('returns true if points are directly connected', () => {
            uf.union(4, 3);
            
            assert.isTrue(uf.connected(3, 4));
        });
        
        it('returns true if points are indirectly connected', () => {
            uf.union(0, 5);
            uf.union(5, 1);
            
            assert.isTrue(uf.connected(0, 1));
        });
        
        it('throws if either input is missing', () => {
            assert.throws(() => uf.connected(), 'connected requires two integer parameters');
            assert.throws(() => uf.connected(1), 'connected requires two integer parameters');
            assert.throws(() => uf.connected(undefined, 1), 'connected requires two integer parameters');
        });
        
        // only worthwhile doing on at least partially connected set - need some setup
        it('has time complexity <= O(lg*n)');
    });
    
    describe('mixed random calls', () => {

        it('handles multiple mixed calls', () => {
            const n = 500;
            const uf = UnionFind(n);
            const functions = Object.keys(uf);
            
            for (let i = 0, max = 5 * n; i < max; i++) {
                // pick random function to call
                let f = functions[helpers.getRandomInt(0, 2)];
                
                uf[f](helpers.getRandomInt(0, n), helpers.getRandomInt(0, n));
            }
        });
    });
});

// returns time in nanoseconds taken to run passed function
function time(fn) {
    const t1 = process.hrtime();
    
    fn();
    
    const diff = process.hrtime(t1);
    return diff[0] * 1e9 + diff[1];
}

function averageTime(fn, sampleSize) {
    sampleSize = sampleSize || 30;
    
    let timeSum = 0;
    
    for (let i = 0; i < sampleSize; i++) {
        timeSum += time(fn);
    }
    
    return timeSum / sampleSize;
}
