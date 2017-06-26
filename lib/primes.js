const primes = (function primesFactory() {
    let primes = [ 2, 3, 5, 7, 11 ];

    function sieveUpTo(max) {
        const maxPrime = primes[primes.length - 1];
        if (max < maxPrime + 2) return;

        let min = maxPrime + 2;
        // arr[i] corresponds to min + i
        const arr = new Array(max - min + 1);

        function removeMultiples(p) {
            let multiple = (min % p) ? p - (min % p) : 0; // first index of a multiple of p
            while (multiple < arr.length) {
                arr[multiple] = 1;
                multiple += p;
            }
        }

        primes.forEach(removeMultiples);

        for (let i = 0; i < arr.length; i++) {
            if (!arr[i]) { // found a prime
                let p = i + min;
                primes.push(p);
                removeMultiples(p);
            }
        }
    }

    // return object with each key a prime factor, each value that prime's power in factorisation
    function primeFactors(n) {
        if (typeof n !== 'number' || n !== Math.floor(n)) throw new Error('Ivalid parameter: Can only factorise integers');
        let max = Math.ceil(Math.sqrt(n));
        sieveUpTo(max);
        let factors = {};
        for (let i = 0; i < primes.length; i++) {
            let p = primes[i];
            if (p > max) break;

            while (n % p == 0) {
                n /= p;
                factors[p] = factors[p] ? factors[p] + 1 : 1;
            }
        }

        if (n > 1) factors[n] = 1;
        return factors;
    }

    function allFactors(n) {
        let pfs;
        if (typeof n === 'number') pfs = primeFactors(n);
        if (typeof n === 'object') pfs = n;
        if (pfs === undefined) throw new Error('Invalid parameter: ' + n);

        let factors = [ 1 ];
        Object.keys(pfs).forEach(factor => {
            let numPreviousFactors = factors.length;
            let maxPower = pfs[factor];
            let currPower = 1;
            for (let i = 0; i < maxPower; i++) {
                currPower *= factor;

                for (let j = 0; j < numPreviousFactors; j++) {
                    factors.push(factors[j] * currPower);
                }
            }
        });

        return factors;
    }

    return {
        sieveUpTo,
        primeFactors,
        allFactors,
        primes: () => primes,
        clearCache: () => primes = [ 2, 3, 5, 7, 11 ]
    }
})();

module.exports = primes;
