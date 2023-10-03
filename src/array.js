export default function init2DArray(
    rowCount,
    columnCount,
    defaultValue = null
) {
    let arr = [];
    for (let y = 0; y < columnCount; y++) {
        let row = [];
        for (let x = 0; x < rowCount; x++) {
            row.push(defaultValue);
        }
        arr.push(row);
    }
    return arr;
}
