module.exports = {
    getRandomInt(lower = 0, upper = 100) {
        return Math.floor(Math.random() * (upper - lower) + lower);
    },
    getRandomIntArray(opts = {}) {
        const {
            min = undefined,
            max = undefined,
            length = 100
        } = opts;
        const arr = new Array(length);

        for (let i = 0; i < length; i++) {
            arr[i] = this.getRandomInt(min, max);
        }

        return arr;
    }
}
