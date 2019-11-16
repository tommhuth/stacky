import { World, Body, SAPBroadphase } from "cannon"
import React, { useRef, useEffect, useState, useContext } from "react"
import { useFrame } from "react-three-fiber"

const context = React.createContext()

export function CannonProvider({
    children,
    iterations = 8,
    defaultRestitution = 0,
    defaultFriction = .1,
    gravity = [0, -10, 0]
}) {
    let [world] = useState(() => new World())

    useEffect(() => {
        world.broadphase = new SAPBroadphase(world)
        world.broadphase.axisIndex = 1
        world.solver.iterations = iterations
        world.defaultContactMaterial.friction = defaultFriction
        world.defaultContactMaterial.restitution = defaultRestitution
        world.gravity.set(...gravity)
    }, [world])

    // Run world stepper every frame
    useFrame(() => world.step(1 / 40))

    // Distribute world via context
    return <context.Provider value={world}>{children}</context.Provider>
}

// Custom hook to maintain a world physics body
export function useCannon({ ...props }, fn, deps = []) {
    let ref = useRef()
    // Get cannon world object
    let world = useContext(context)
    // Instanciate a physics body
    let [body] = useState(() => new Body(props))

    useEffect(() => {
        // Call function so the user can add shapes
        fn(body)

        // Add body to world on mount
        world.addBody(body)

        // Remove body on unmount
        return () => world.removeBody(body)
    }, deps)

    useFrame(() => {
        if (ref.current) {
            // Transport cannon physics into the referenced threejs object
            ref.current.position.copy(body.position)
            ref.current.quaternion.copy(body.quaternion)
        }
    })

    return ref
}
