
import React, { useState, useEffect } from "react"
import { Box3, Vector3 } from "three"
import Slice from "./Slice"
import { useRender } from "react-three-fiber"
import Camera from "./Camera"

function getPositionWithOffset(x, y, z, offset, axis) {
    return [
        x + (getOffset(offset) * (axis === "x" ? 1 : 0)),
        y,
        z + (getOffset(offset) * (axis === "z" ? 1 : 0))
    ]
}

function getOffset(offset) {
    return Math.cos(offset) * 14
}

export default function Stack() {
    const [slices, setSlices] = useState([
        { position: [0, -14, 0], size: [10, 30, 10], mass: 0 }
    ])
    const [leftovers, setLeftovers] = useState([])
    const [sliceOffset, setSliceOffset] = useState(0)
    const [offsetAxis, setOffsetAxis] = useState("x")
    const [gameOver, setGameOver] = useState(false)
    const prev = slices[slices.length - 1]

    useRender(() => {
        setSliceOffset(prev => {
            return prev + .0125
        })
    }, false, [sliceOffset])

    useEffect(() => {
        const handleClick = () => {
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
            let top = bottom.clone().translate(
                new Vector3(offsetAxis === "x" ? getOffset(sliceOffset - .025) : 0, 0, offsetAxis === "z" ? getOffset(sliceOffset - .025) : 0)
            )
            let bottomSize = bottom.getSize(new Vector3())
            let y = slices.length * 2

            if (bottom.intersectsBox(top)) {
                let intersection = bottom.clone().intersect(top)
                let size = intersection.getSize(new Vector3())
                let center = intersection.getCenter(new Vector3())

                setSlices(p => [
                    ...p,
                    {
                        position: [center.x, y, center.z],
                        size: [size.x, 2, size.z],
                        mass: 0
                    }
                ])

                for (let offset of offsetAxis === "x" ? [bottomSize.x, -bottomSize.x] : [bottomSize.z, -bottomSize.z]) {
                    let offsetBottom = bottom.clone().translate(
                        new Vector3(offsetAxis === "x" ? offset : 0, 0, offsetAxis === "z" ? offset : 0)
                    )

                    if (offsetBottom.intersectsBox(top)) {
                        let offsetLeft = offsetBottom.clone().intersect(top)
                        let size = offsetLeft.getSize(new Vector3())
                        let center = offsetLeft.getCenter(new Vector3())

                        setLeftovers(p => [
                            ...p,
                            {
                                position: [center.x, y, center.z],
                                size: [size.x, 2, size.z],
                                mass: size.x * 2 * size.z
                            }
                        ])
                    }
                }
            } else {
                let size = bottom.getSize(new Vector3())
                let center = bottom.getCenter(new Vector3())

                setGameOver(true)
                setSlices(p => [
                    ...p,
                    {
                        position: getPositionWithOffset(center.x, y, center.z, sliceOffset, offsetAxis),
                        size: [size.x, 2, size.z],
                        mass: size.x * 2 * size.z
                    }
                ])
            }

            setSliceOffset(0)
            setOffsetAxis(offsetAxis === "x" ? "z" : "x")
        }

        window.addEventListener("click", handleClick)

        return () => window.removeEventListener("click", handleClick)
    }, [sliceOffset, slices, offsetAxis])

    return (
        <>
            <Camera position={[10, slices.length * 2 + 25, 10]} target={[0, 0, 0]} />

            <Only if={!gameOver}>
                <Slice key={slices.length}
                    size={[prev.size[0], 2, prev.size[2]]}
                    mass={0}
                    position={getPositionWithOffset(prev.position[0], slices.length * 2, prev.position[2], sliceOffset, offsetAxis)}
                />
            </Only>

            {slices.map((i, index) => {
                return <Slice key={index} position={i.position} mass={i.mass} size={i.size} />
            })}

            {leftovers.map((i, index) => {
                return <Slice key={index} position={i.position} mass={i.mass} size={i.size} />
            })}
        </>
    )
}

function Only(props) {
    return props.if ? <>{props.children}</> : null
}
