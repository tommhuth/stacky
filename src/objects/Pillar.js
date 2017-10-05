import Slice from "./Slice"
   
export default class Pillar extends Slice {
    constructor(width, height, depth, sliceHeight) {
        super(width, height, depth, 0, (-height / 2) - (sliceHeight / 2), 0, undefined,0)
    }
}
