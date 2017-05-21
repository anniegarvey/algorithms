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
    });
});
