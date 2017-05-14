/*
    Queue (Doubly Linked List)
*/
function Queue() {

    // references to first and last nodes (sentinels)
    let first = Node(null, null, null);
    let last = Node(first, null, null);

    first.next = last;

    let size = 0;

    function Node(prev, next, value) {
        return {
            prev,
            next,
            value
        }
    }

    function enqueue(item) {
        const next = first.next;
        first.next = Node(first, next, item);
        next.prev = first.next;
        size++;
    }

    function dequeue() {
        if (isEmpty()) throw new Error('Invalid operation: Queue is empty');

        let result = last.prev;
        last.prev = result.prev;
        last.prev.next = last;
        size--;

        return result.value;
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

module.exports = Queue;