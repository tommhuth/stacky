import { useFrame } from "@react-three/fiber"
import { useEffect, useMemo } from "react"
import { BoxBufferGeometry } from "three"
import { getColorAt } from "../utils/color"
import { setAxisFlipped, setInstance, setSlice, SliceType, State, useStore } from "../utils/store"
import Slice from "./Slice"

const boxGeometry = new BoxBufferGeometry(1, 1, 1, 1, 1, 1)

export default function Stack() {
    let list = useStore(i => i.stack.parts)
    let height = useStore(i => i.stack.height)
    let axis = useStore(i => i.stack.axis)
    let axisFlipped = useStore(i => i.stack.axisFlipped)
    let state = useStore(i => i.state)
    let maxIndex = useStore(i => i.stack.maxIndex)
    let slice = useStore(i => i.stack.slice)
    let topSlice = list.find(i => i.type === SliceType.SLICE)
    let axisIndex = axis === "x" ? 0 : 2
    let reverseAxis = axis === "x" ? "z" : "x"
    let reverseAxisIndex = reverseAxis == "x" ? 0 : 2
    let axisOffset = 7
    let baseColor = useMemo(() => getColorAt(0), [])
    let topColor = useMemo(() => getColorAt(height + 1), [height])

    useFrame((_state, delta) => {
        if (state !== State.ACTIVE || !slice) {
            return
        }

        let speed = 7.5 * delta 

        slice.position.y = topSlice.position[1] + 1
        slice.position[axis] += speed * (axisFlipped ? -1 : 1)

        if (slice.position[axis] > topSlice.position[axisIndex] + Math.max(topSlice.size[axisIndex], axisOffset)) {
            setAxisFlipped(true)
        }

        if (slice.position[axis] < topSlice.position[axisIndex] - Math.max(topSlice.size[axisIndex], axisOffset)) {
            setAxisFlipped(false)
        }
    })

    useEffect(() => {
        if (!slice) {
            return
        }

        slice.position[axis] = topSlice.position[axisIndex] + axisOffset * (axisFlipped ? 1 : -1)
        slice.position[reverseAxis] = topSlice.position[reverseAxisIndex]
    }, [topSlice, slice])

    return (
        <>
            <mesh scale={[5, 100, 5]} position={[0, -50, 0]}>
                <primitive object={boxGeometry} attach="geometry" />
                <meshLambertMaterial
                    dithering
                    color={baseColor}
                />
            </mesh>
            <instancedMesh
                args={[undefined, undefined, maxIndex]}
                ref={e => {
                    if (e) {
                        setInstance(e)
                    }
                }}
            >
                <primitive object={boxGeometry} attach="geometry" />
                <meshLambertMaterial dithering />
            </instancedMesh>

            <mesh
                visible={state === State.ACTIVE}
                ref={setSlice}
                scale={topSlice.size}
            >
                <primitive object={boxGeometry} attach="geometry" />
                <meshLambertMaterial dithering color={topColor} />
            </mesh>

            {list.map(i => {
                return (
                    <Slice key={i.id} {...i} />
                )
            })}
        </>
    )
}


/*


    useEffect(() => { 
        const center = new Vector3()
        const size = new Vector3()
        const onClick = (e) => {
            console.log("STACK EVT")
            let { state, stack } = store.getState()

            if (state !== State.ACTIVE) {
                return
            } 

            let topSlice = stack.parts.find(i => i.type === SliceType.SLICE)
            let top = new Box3().setFromObject(topRef.current)
            let bottom = new Box3().setFromCenterAndSize(
                new Vector3(topSlice.position[0], topRef.current.position.y, topSlice.position[2]),
                new Vector3(...topSlice.size)
            )
            let deintersection = difference(top, bottom)
            let intersection = top.intersect(bottom)
            let parts = []
            let color = getColorAt(stack.height + 1, 1)

            if (deintersection && !isBoxEmpty(deintersection)) {
                deintersection.getCenter(center)
                deintersection.getSize(size)

                parts.push({
                    size: size.toArray(),
                    position: [center.x, topSlice.position[1] + 1, center.z],
                    color,
                    type: SliceType.FRAGMENT,
                })
            }

            intersection.getCenter(center)
            intersection.getSize(size)

            if (!isBoxEmpty(intersection)) {
                parts.push({
                    size: size.toArray(),
                    position: [center.x, topSlice.position[1] + 1, center.z],
                    color,
                    type: SliceType.SLICE,
                })
            } else {
                gameOver()
            }

            addParts(parts)
            setAxis(i => i === "x" ? "z" : "x")
            flip.current = !flip.current
        }

        window.addEventListener("mousedown", onClick)
        window.addEventListener("touchstart", onClick)

        return () => {
            window.removeEventListener("mousedown", onClick)
            window.removeEventListener("touchstart", onClick)
        }
    }, [])
    */