/*
    UnionFind (Weighted Quick Union with Path Compression)

    Use: Find whether or not two items in a set (of integers) with transitive connections are connected

    Performance (size of set is N):
        initialise: N
        union: lg*N
        connected: lg*N
*/

function UnionFind(n) {
    
    if (typeof n == 'undefined') throw new Error('Missing size parameter');

    // start with totally unconnected set size n
    const id = new Array(n);
    const sz = new Array(n);

    for (let i = 0; i < n; i++) {
        id[i] = i;
        sz[i] = 1;
    }
    

    // find root of tree containing p
    function root(p) {
        let r = id[p];

        while(r !== id[r]) {
            // concise path compression FTW
            id[r] = id[id[r]];
            r = id[r];
        }

        return r;
    }

    // connects integers p and q
    function union(p, q) {
        if (typeof p != 'number' || typeof q != 'number')
            throw new Error('union requires two integer parameters'); 

        let rP = root(p);
        let rQ = root(q);

        // already connected
        if (rP === rQ) return;

        // link root of smaller tree to larger tree and update sizes
        if (sz[rP] < sz[rQ]) {
            id[rP] = rQ;
            sz[rQ] += sz[rP];
        } else {
            id[rQ] = rP;
            sz[rP] += sz[rQ];
        }
    }

    // returns true if p and q lie in same connected subset, false otherwise
    function connected(p, q) {
        if (typeof p != 'number' || typeof q != 'number')
            throw new Error('connected requires two integer parameters');
        
        return root(p) === root(q);
    }

    // interface
    return {
        union,
        connected
    }
}

module.exports = UnionFind;