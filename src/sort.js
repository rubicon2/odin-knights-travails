export function MergeSort(arr, comparatorFn = null) {
    if (arr.length === 1) return arr;

    let left = MergeSort(arr.slice(0, arr.length / 2));
    let right = MergeSort(arr.slice(arr.length / 2));

    let sorted = [];

    // Supply a comparatorFn to sort an array by any arbitrary means, e.g. a field on an object or class
    if (!comparatorFn) {
        while (left.length > 0 && right.length > 0) {
            if (left[0] < right[0]) sorted.push(left.shift());
            else sorted.push(right.shift());
        }
    } else {
        while (left.length > 0 && right.length > 0) {
            if (comparatorFn(left[0], right[0])) sorted.push(left.shift());
            else sorted.push(right.shift());
        }
    }

    return sorted.concat(left, right);
}
