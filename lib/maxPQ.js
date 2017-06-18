/*

*/

function MaxPQ() {
    const arr = new Array();
    let size = 0;

    function exch(a, b) {
        let temp = arr[a];
        arr[a] = arr[b];
        arr[b] = temp;
    }

    function less(a, b) {
        return getPriority(arr[a]) < getPriority(arr[b]);
    }

    function getPriority(a) {
        return (a && typeof a.priority === 'function') ? a.priority() : a;
    }

    function parentIndex(i) {
        return Math.floor(i / 2);
    }

    function swim(i) {
        while (i > 1 && less(parentIndex(i), i)) {
            exch(parentIndex(i), i);
            i = parentIndex(i);
        }
    }

    function sink(i) {
        while (2 * i <= size) {
            let c = 2 * i;
            if (c < size && less(c, c + 1)) c++; // find smaller child
            if (!less(i, c)) break;
            exch(i, c);
            i = c;
        }
    }

    function insert(item) {
        arr[++size] = item;
        swim(size);
    }

    function delMax() {
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
        delMax,
        isEmpty
    }
}

module.exports = MaxPQ;
