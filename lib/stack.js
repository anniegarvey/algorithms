/*
    Stack (Resizing array)

    Will accept any type of content, but perform better with integers
*/

function Stack() {

    let arr = new Array(1);
    let size = 0;

    function resize(capacity) {
        let temp = new Array(capacity);

        for (let i = 0; i < size; i++) {
            temp[i] = arr[i];
        }

        arr = temp;
    }

    function push(item) {
        if (size >= arr.length) resize(2 * size);

        arr[size++] = item;
    }

    function pop() {
        if (isEmpty()) throw new Error('Invalid operation: Stack is empty');
        
        size--;

        let result = arr[size];
        arr[size] = null;

        if (size < arr.length / 4 && size > 0) {
            resize(arr.length / 2)
        }

        return result;
    }

    function isEmpty() {
        return size == 0;
    }

    return {
        push,
        pop,
        isEmpty
    }
}

module.exports = Stack;