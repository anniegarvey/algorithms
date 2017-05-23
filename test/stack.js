const assert = require('chai').assert;
const helpers = require('../lib/helpers');
const Stack = require('../lib/stack');


describe('Stack', () => {
    
	describe('construction', () => {
        
		it('returns object with functions push, pop and isEmpty', () => {
            const s = Stack();
            
            assert.sameMembers(Object.keys(s), [ 'push', 'pop', 'isEmpty' ]);
            
            Object.keys(s).forEach(key => {
                assert.isFunction(s[key]);
            });
        });
	});
    
    describe('.push()', () => {
        
        let stack;
        
        beforeEach(() => {
            stack = Stack();
        });
        
        it('accepts any type of input', () => {
            // note this is not a recommended use! 
            // for performance gains, keep types in stack the same, preferably ints
            assert.doesNotThrow(() => {
                stack.push(null);
                stack.push(123);
                stack.push(1.23);
                stack.push('123');
                stack.push({});
                stack.push([]);
            });
        });
        
        it('makes stack not empty', () => {
            assert.isTrue(stack.isEmpty());
            
            stack.push(1);
            
            assert.isFalse(stack.isEmpty());
        });
        
        it('puts items on the stack to be popped off', () => {
            stack.push(1);
            stack.push(2);
            stack.push(3);
            
            assert.equal(stack.pop(), 3);
            assert.equal(stack.pop(), 2);
            assert.equal(stack.pop(), 1);
        });

        it(`has amortised time complexity O(1)`);
    });
    
    describe('.pop()', () => {
        
        let stack;
        
        beforeEach(() => {
            stack = Stack();
        });
        
        it('makes stack empty', () => {
            stack.push(1);
            assert.isFalse(stack.isEmpty());
            
            stack.pop();
            assert.isTrue(stack.isEmpty());
        });
        
        it('throws if called on empty stack', () => {
            assert.throws(() => stack.pop(), 'Invalid operation: Stack is empty');
        });
        
        it('returns stacked items in reverse order', () => {
            const arr = [ 3, 1, 8, 4, 9, 5 ,2 ];
            
            arr.forEach(item => stack.push(item));
            
            for (let i = arr.length - 1; i >= 0; i--) {
                assert.equal(stack.pop(), arr[i]);
            }
        });
        
        it(`has amortised time complexity O(1)`);
    });
    
    
    describe('.isEmpty()', () => {
        
        let stack;
        
        beforeEach(() => {
            stack = Stack();
        });
        
        it('returns true for new empty stack', () => {
            assert.isTrue(stack.isEmpty());
        });
        
        it('returns false for a non-empty stack', () => {
            stack.push(123);
            assert.isFalse(stack.isEmpty());
        });
        
        it('returns true for an emptied stack', () => {
            stack.push('something');
            stack.pop();
            assert.isTrue(stack.isEmpty());
        });
        
        it('retains correct state if pop is called on empty stack', () => {
            stack.push(0);
            stack.pop();
            try {
                stack.pop();
            } catch (e) {}
            assert.isTrue(stack.isEmpty());
            stack.push('something else');
            assert.isFalse(stack.isEmpty());
        });
    });
    
    describe('mixed random calls', () => {

        it('handles multiple mixed calls', () => {
            const n = 500;
            const s = Stack();
            const functions = Object.keys(s);
            
            for (let i = 0, max = 5 * n; i < max; i++) {
                // pick random function to call
                let f = functions[helpers.getRandomInt(0, 2)];
                
                try {
                    // diff funcs have diff number of params, but will ignore extras anyway
                    s[f](helpers.getRandomInt(0, n));
                } catch (e) {
                    assert.equal(e, 'Error: Invalid operation: Stack is empty');
                }
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
