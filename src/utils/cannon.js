import { World, NaiveBroadphase, Body } from "cannon"
import React, { useRef, useEffect, useState, useContext } from "react"
import { useRender } from "react-three-fiber"

const context = React.createContext()

export function CannonProvider({ children }) { 
    const [world] = useState(() => new World())

    useEffect(() => {
        world.broadphase = new NaiveBroadphase()
        world.solver.iterations = 8
        world.defaultContactMaterial.friction = 10
        world.defaultContactMaterial.restitution = .3
        world.gravity.set(0, -9.8, 0)
    }, [world])

    // Run world stepper every frame
    useRender(() => world.step(1 / 40))

    // Distribute world via context
    return <context.Provider value={world} children={children} />
}

// Custom hook to maintain a world physics body
export function useCannon({ ...props }, fn, deps = []) {
    const ref = useRef()
    // Get cannon world object
    const world = useContext(context)
    // Instanciate a physics body
    const [body] = useState(() => new Body(props))

    useEffect(() => {
        // Call function so the user can add shapes
        fn(body)

        // Add body to world on mount
        world.addBody(body)

        // Remove body on unmount
        return () => world.removeBody(body)
    }, deps)

    useRender(() => {
        if (ref.current) {
            // Transport cannon physics into the referenced threejs object
            ref.current.position.copy(body.position)
            ref.current.quaternion.copy(body.quaternion)
        }
    })

    return ref
}
