/*
    Min Priority Queue
    
    Binary heap based collection of items, delMin returns them in ascending order of priority/value
    
    insert and delMin are both O(log(n))
*/

function MinPQ() {
    const arr = new Array();
    let size = 0;

    function exch(a, b) {
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    function more(a, b) {
        return getPriority(arr[a]) > getPriority(arr[b]);
    }

    function getPriority(a) {
        return (a && typeof a.priority === 'function') ? a.priority() : a;
    }

    function parentIndex(i) {
        return Math.floor(i / 2);
    }

    function swim(i) {
        while (i > 1 && more(parentIndex(i), i)) {
            exch(parentIndex(i), i);
            i = parentIndex(i);
        }
    }

    function sink(i) {
        while (2 * i <= size) {
            let c = 2 * i;
            if (c < size && more(c, c + 1)) c++; // find smaller child
            if (!more(i, c)) break;
            exch(i, c);
            i = c;
        }
    }

    function insert(item) {
        arr[++size] = item;
        swim(size);
    }

    function delMin() {
        if (isEmpty()) throw new Error('Invalid operation: Queue is empty');

        let max = arr[1];
        exch(1, size--);
        sink(1);
        arr[size + 1] = undefined;
        return max;
    }

    function isEmpty() {
        return size == 0;
    }

    return {
        insert,
        delMin,
        isEmpty
    }
}

module.exports = MaxPQ;
