const assert = require('chai').assert;
const sinon = require('sinon');

const primes = require('../lib/primes');

describe('primes', () => {

    const primesToOneHundred = [
        2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41,
        43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97
    ];

    beforeEach(() => {
        primes.clearCache();
    });

    describe('.primes()', () => {

        it('initially contains first few primes', () => {
            assert.sameMembers(primes.primes(), [ 2, 3, 5, 7, 11 ]);
        });

        it('is added to by sieveUpTo', () => {
            const origLength = primes.primes.length;
            primes.sieveUpTo(30);
            assert.isAbove(primes.primes().length, origLength);
        });
    });

    describe('sieveUpTo', () => {

        it('finds only primes up to given parameter', () => {
            primes.sieveUpTo(100);
            assert.sameMembers(primes.primes(), primesToOneHundred);
        });

        it('includes parameter if prime', () => {
            primes.sieveUpTo(97);
            assert.include(primes.primes(), 97);
        });

        it('does nothing if parameter <= curr max prime');
    });

    describe('.primeFactors()', () => {

        [
            null,
            {},
            0.5,
            [],
            () => {},
            '7'
        ].forEach(nonInteger => {
            it('throws if passed non-integer ' + nonInteger, () => {
                assert.throws(() => primes.primeFactors(nonInteger));
            });
        });

        it('throws if integer input is too large to be precise', () => {
            assert.throws(() => primes.primeFactors(Number.MAX_SAFE_VALUE + 1));
        });

        it('accepts integer input', () => {
            assert.doesNotThrow(() => primes.primeFactors(121));
        });

        it('returns an object with all keys primes', () => {
            const res = primes.primeFactors(21);
            assert.isObject(res);
            Object.keys(res).forEach(key => assert.include(primes.primes(), +key));
        });

        it('only has keys which are factors of input', () => {
            const factors = [2, 7, 19, 23];
            const res = primes.primeFactors(factors.reduce((acc, curr) => acc * curr, 1));

            assert.sameMembers(Object.keys(res).map(k => +k), factors);
        });

        it('returns as values the power of each prime in inputs prime factorisation', () => {
            const input = 2 * 2 * 3 * 7 * 7 * 7 * 11;
            assert.deepEqual(primes.primeFactors(input), {
                2: 2,
                3: 1,
                7: 3,
                11: 1
            });
        });
    });

    describe('.allFactors()', () => {

        function bruteGetFactors(input) {
            const factors = [];
            for (let i = 1; i <= input; i++) {
                if (input % i === 0) factors.push(i);
            }
            return factors;
        }

        it('returns an array of integers', () => {
            const res = primes.allFactors(6);
            assert.isArray(res);
            res.forEach(item => {
                assert.isNumber(item);
                assert.equal(item, Math.floor(item));
            });
        });

        it('accepts an integer input', () => {
            assert.doesNotThrow(() => primes.allFactors(19));
        });

        it('accepts an object of prime factor powers', () => {
            assert.doesNotThrow(() => primes.allFactors({ 5: 1, 13: 3 }));
        });

        it('returns all factors of integer input', () => {
            const input = 12345;
            const factors = bruteGetFactors(input);
            assert.sameMembers(primes.allFactors(input), factors);
        });

        it('returns all factors of obj input', () => {
            const input = 12345;
            const obj = primes.primeFactors(input);
            const factors = bruteGetFactors(input);
            assert.sameMembers(primes.allFactors(obj), factors);
        });
    });
});
