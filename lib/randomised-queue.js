/*
	Randomised Queue
	
	Variable sized collection that outputs elements in random order
*/

const helpers = require('./helpers');

function RandomisedQueue() {

    let arr = new Array(1);
    let size = 0;
    
    function resize(capacity) {
        let temp = new Array(capacity);
        
        for (let i = 0; i < size; i++) {
            temp[i] = arr[i];
        }
        
        arr = temp;
    }
    
    function enqueue(item) {
        if (size >= arr.length) resize(2 * size);
        
        let index = helpers.getRandomInt(0, size + 1);
        arr[size++] = arr[index];
        arr[index] = item;
    }
    
    function dequeue() {
        if (isEmpty()) throw new Error('Invalid operation: Queue is empty');
        
        size--;
        
        let result = arr[size];
        arr[size] = null;
        
        if (size < arr.length / 4 && size > 0) {
            resize(arr.length / 2);
        }
        return result;
    }
    
    function isEmpty() {
        return size == 0;
    }
    
    return {
        enqueue,
        dequeue,
        isEmpty
    }
}

module.exports = RandomisedQueue;
