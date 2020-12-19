/**
 * Calculate cartesian product of T[][]
 * source: https://stackoverflow.com/a/55001358
 * @param arr 
 */
export function cartesianProduct<T> (arr: T[][]): T[][] {
    return arr.reduce((a, b) => {
        return a.map(x => {
            return b.map(y => {
                return x.concat(y)
            })
        }).reduce((c, d) => c.concat(d), [])
    }, [[]] as T[][])
}