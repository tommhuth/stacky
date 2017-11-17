export function getMass(mesh) {
    let boundingBox = mesh.getBoundingInfo().boundingBox

    return boundingBox.extendSize.z * boundingBox.extendSize.x * boundingBox.extendSize.y
}