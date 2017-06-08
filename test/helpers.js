const assert = require('chai').assert;
const sinon = require('sinon');
const helpers = require('../lib/helpers');

describe('helpers', () => {

    describe('.getRandomInt()', () => {

        beforeEach(() => {
            sinon.stub(Math, 'random');
        });

        afterEach(() => {
            Math.random.restore();
        });

        it('returns an integer greater than or equal the lower bound', () => {
            Math.random.returns(0); // lowest possible value
            assert.equal(helpers.getRandomInt(-19, 7), -19);
        });

        it('returns an integer less than upper bound', () => {
            Math.random.returns(0.9999);
            assert.isAtMost(helpers.getRandomInt(0, 100), 100);
        });

        it('defaults to min 0', () => {
            Math.random.returns(0);
            assert.equal(helpers.getRandomInt(), 0);
        });

        it('defaults to max 100', () => {
            Math.random.returns(0.9999);
            assert.equal(helpers.getRandomInt(), 99);
        });
    });

    describe('.getRandomIntArray()', () => {

        it('returns an array of integers', () => {
            const result = helpers.getRandomIntArray();

            assert.isArray(result);

            result.forEach(item => {
                assert.isNumber(item);
                assert.equal(item, Math.floor(item));
            });
        });

        it('returns an array of length 100 by default', () => {
            assert.equal(helpers.getRandomIntArray().length, 100);
        });

        it('returns an array with length specified in opts', () => {
            const length = 89;
            assert.equal(helpers.getRandomIntArray({ length }).length, length);
        });

        it('returns an array filled with random integers', () => {
            sinon.stub(helpers, 'getRandomInt').returns(42);
            helpers.getRandomIntArray().forEach(item => assert.equal(item, 42));
            helpers.getRandomInt.restore();
        });

        it('uses min and max opts to set range of integers', () => {
            const min = -5;
            const max = 17;
            sinon.spy(helpers, 'getRandomInt');
            helpers.getRandomIntArray({ min, max });

            assert.isTrue(helpers.getRandomInt.calledWith(min, max));

            helpers.getRandomInt.restore();
        });
    });
});
