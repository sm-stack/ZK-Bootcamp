function transform(obj, key, fn) {
    if (Array.isArray(obj[key][0])) {  // Check if it's a nested array
        obj[key] = obj[key].map(arr => arr.map(fn));
    } else {
        obj[key] = obj[key].map(fn);
    }
}

function hexToBigInt(hex) {
    return BigInt(hex).toString();
}

module.exports = {
    transform,
    hexToBigInt
}