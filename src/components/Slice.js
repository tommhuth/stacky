import random from "@huth/random"
import { useFrame } from "@react-three/fiber"
import { Box, Vec3 } from "cannon-es"
import { memo, useEffect, useLayoutEffect, useMemo, useRef } from "react"
import { Color } from "three"
import { removePart, SliceType, useStore } from "../utils/store"
import { useInstancedBody } from "../utils/cannon"
import { cameraStartY } from "./Camera"

const _color = new Color()

const Slice = memo(function ({ position, color, index, type, size, id }) {
    let instance = useStore(i => i.stack.instance)
    let hasSetColor = useRef(false)
    let dead = useRef(false)
    let definition = useMemo(() => new Box(new Vec3(size[0] / 2, size[1] / 2, size[2] / 2)), size)
    let [body] = useInstancedBody({
        keepAround: type === SliceType.SLICE,
        instance,
        index,
        position,
        mass: type === SliceType.FRAGMENT ? size[0] * size[2] : 0,
        scale: size,
        definition,
    })

    useEffect(() => {
        if (type === SliceType.FRAGMENT) {
            body.applyLocalImpulse(
                new Vec3(0, -size[0] * size[2] * random.float(1.25, 2), 0),
                new Vec3(random.float(-size[0] / 2, size[0] / 2), 0, random.float(-size[2] / 2, size[2] / 2))
            )
        }
    }, [body, type])

    useLayoutEffect(() => {
        if (instance && !hasSetColor.current) {
            instance.setColorAt(index, _color.set(color))
            instance.instanceColor.needsUpdate = true
            hasSetColor.current = true
        }
    }, [instance, index])

    useFrame(({ camera, viewport }) => {
        let threshold = cameraStartY + viewport.getCurrentViewport(camera).height * 2
        let isOffscreen = body.position.y + threshold < camera.position.y

        if (isOffscreen && !dead.current) {
            dead.current = true
            removePart(id)
        }
    })

    return null
})

export default Slice