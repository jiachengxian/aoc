"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cartesianProduct = void 0;
/**
 * Calculate cartesian product of T[][]
 * source: https://stackoverflow.com/a/55001358
 * @param arr
 */
function cartesianProduct(arr) {
    return arr.reduce((a, b) => {
        return a.map(x => {
            return b.map(y => {
                return x.concat(y);
            });
        }).reduce((c, d) => c.concat(d), []);
    }, [[]]);
}
exports.cartesianProduct = cartesianProduct;
