import create from "zustand"
import Config from "../Config"
import ColorMixer from "../utils/ColorMixer"
import { Box3, Vector3 } from "three"
import { getPositionWithOffset, getOffset } from "../utils/helpers"

const init = {
    sliceOffset: 0,
    offsetAxis: "x",
    state: Config.STATE_READY,
    directHits: 0,
    fragments: [],
    slices: [
        {
            position: [
                0,
                -(Config.BOTTOM_SLICE_HEIGHT / 2 - Config.SLICE_HEIGHT / 2),
                0
            ],
            size: [Config.SLICE_SIZE, Config.BOTTOM_SLICE_HEIGHT, Config.SLICE_SIZE],
            mass: 0,
            color: ColorMixer.next()
        }
    ]
}

const [useStore, api] = create((set, get) => {
    return {
        // data
        ...init,

        // actions
        incrementOffset() {
            let sliceOffset = get().sliceOffset + Config.SLICE_SPEED_INCREMENT

            set({ sliceOffset })
        }, 
        restart() {
            ColorMixer.reset()
            set({ ...init, state: Config.STATE_ACTIVE })
        }, 
        addSlice(slice) {
            set({
                slices: [
                    ...get().slices,
                    slice
                ]
            })
        },
        addFragment(fragment) {
            set({
                fragments: [
                    ...get().fragments,
                    fragment
                ]
            })
        },
        start() {
            set({ state: Config.STATE_ACTIVE })
        },
        match() {
            let {
                offsetAxis,
                directHits,
                slices,
                sliceOffset, 
                addFragment,
                addSlice,
            } = get()
            let prev = slices[slices.length - 1]
            let bottom = new Box3(
                new Vector3(
                    prev.position[0] - prev.size[0] / 2,
                    prev.position[1] - prev.size[1] / 2,
                    prev.position[2] - prev.size[2] / 2
                ),
                new Vector3(
                    prev.position[0] + prev.size[0] / 2,
                    prev.position[1] + prev.size[1] / 2,
                    prev.position[2] + prev.size[2] / 2
                )
            )
            let bottomSize = bottom.getSize(new Vector3())
            let y = slices.length * Config.SLICE_HEIGHT
            let distance = bottom.getCenter(new Vector3()).distanceTo(new Vector3(
                bottom.getCenter(new Vector3()).x + (offsetAxis === "x" ? getOffset(sliceOffset) : 0),
                bottom.getCenter(new Vector3()).y,
                bottom.getCenter(new Vector3()).z + (offsetAxis === "z" ? getOffset(sliceOffset) : 0)
            ))
            let directHit = distance < Config.DIRECT_HIT_THRESHOLD
            let directHitAddition = directHit && directHits + 1 >= Config.DIRECT_HIT_ADDITION_THRESHOLD
            let top = bottom.clone().translate(
                new Vector3(
                    offsetAxis === "x" && !directHit ? getOffset(sliceOffset) : 0,
                    0,
                    offsetAxis === "z" && !directHit ? getOffset(sliceOffset) : 0
                )
            )

            if (directHit && !directHitAddition) {
                set({ directHits: directHits+1 }) 
            } else {
                set({ directHits: 0 })
            }

            if (bottom.intersectsBox(top)) {
                let intersection = bottom.clone().intersect(top)
                let size = intersection.getSize(new Vector3())
                let center = intersection.getCenter(new Vector3())
                let sizeOffsets = offsetAxis === "x" ? [bottomSize.x, -bottomSize.x] : [bottomSize.z, -bottomSize.z]

                if (!directHit) {
                    for (let offset of sizeOffsets) {
                        let offsetBottom = bottom.clone().translate(
                            new Vector3(
                                offsetAxis === "x" ? offset : 0,
                                0,
                                offsetAxis === "z" ? offset : 0
                            )
                        )

                        if (offsetBottom.intersectsBox(top)) {
                            let offsetLeft = offsetBottom.clone().intersect(top)
                            let size = offsetLeft.getSize(new Vector3())
                            let center = offsetLeft.getCenter(new Vector3())

                            addFragment({
                                position: [center.x, y, center.z],
                                size: [size.x, Config.SLICE_HEIGHT, size.z],
                                mass: size.x * Config.SLICE_HEIGHT * size.z,
                                color: ColorMixer.previous()
                            })
                        }
                    }
                }

                addSlice({
                    position: [center.x, y, center.z],
                    size: [
                        size.x + (directHitAddition ? .1 : 0),
                        Config.SLICE_HEIGHT,
                        size.z + (directHitAddition ? .1 : 0)
                    ],
                    mass: 0,
                    color: ColorMixer.previous(),
                    directHit
                })
            } else {
                let size = bottom.getSize(new Vector3())
                let center = bottom.getCenter(new Vector3())
 
                set({ state: Config.STATE_GAME_OVER })
                addFragment({
                    position: getPositionWithOffset(center.x, y, center.z, sliceOffset, offsetAxis),
                    size: [size.x, Config.SLICE_HEIGHT, size.z],
                    mass: size.x * Config.SLICE_HEIGHT * size.z,
                    color: ColorMixer.previous()
                })
            }

            set({ sliceOffset: 0 , offsetAxis: offsetAxis === "x" ? "z" : "x"})
       
        }
    }
})

export { useStore, api }
