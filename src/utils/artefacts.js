function getSubTypes(array = [], rawMaterial) {
    return array.filter(subType => subType.raw_material == rawMaterial);
}

export {
    getSubTypes
}