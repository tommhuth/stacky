import { useFrame } from "@react-three/fiber"
import { useEffect, useLayoutEffect, useMemo, useRef } from "react"
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
    let bottomSlice = useRef()
    let topSlice = list.find(i => i.type === SliceType.SLICE)
    let axisIndex = axis === "x" ? 0 : 2
    let reverseAxis = axis === "x" ? "z" : "x"
    let reverseAxisIndex = reverseAxis == "x" ? 0 : 2
    let axisOffset = 7
    let baseColor = useMemo(() => getColorAt(0), [])
    let topColor = useMemo(() => getColorAt(height + 1), [height])

    useLayoutEffect(() => {
        bottomSlice.current.position.y = -200
    }, []) 

    useLayoutEffect(()=> {
        if (slice) { 
            slice.position.y = topSlice.position[1] + 1
        } 
    }, [slice])

    useEffect(() => {
        if (state === State.ACTIVE) {
            bottomSlice.current.position.y = -50
        }
    }, [state])

    useFrame((_state, delta) => {  
        if (state !== State.IDLE) {
            return
        }

        bottomSlice.current.position.y += (-50 - bottomSlice.current.position.y) * 3 * delta
    })

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
            <mesh 
                ref={bottomSlice} 
                scale={[5, 100, 5]} 
                // visible={state !== State.LOADING}
            >
                <primitive object={boxGeometry} attach="geometry" />
                <meshLambertMaterial
                    dithering
                    color={baseColor}
                />
            </mesh>
            <instancedMesh
                visible={state !== State.LOADING}
                args={[undefined, undefined, maxIndex]}
                ref={e => {
                    if (e) {
                        setInstance(e)
                        console.log("xx")
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
