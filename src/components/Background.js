import { cameraStartY } from "../components/Camera"
import { useEffect, useRef } from "react"
import { State, useStore } from "../utils/store"
import { Color, MeshBasicMaterial, Vector3 } from "three"
import { useFrame, useThree } from "@react-three/fiber"
import animate from "@huth/animate"
import { useShader } from "../utils/hooks"
import { glsl } from "../utils/utils"
import { getMajorColorAt, palette } from "../utils/color"

let _position = new Vector3()
let _color = new Color()

export default function Background() {
    let { viewport: { getCurrentViewport }, camera, scene } = useThree()
    let position = [-10, -20, 10]
    let height = useStore(i => i.stack.height)
    let state = useStore(i => i.state)
    let topOpacity =  0
    let bottomOpacity =  .8
    let ref = useRef()
    let [material, uniforms] = useShader({
        fog: false,
        dithering: true,
        transparent: true,
        uniforms: {
            uTopColor: {
                value: [...palette[1].toArray(), topOpacity * .5],
                type: "v4"
            },
            uBottomColor: {
                value: [...palette[0].toArray(), bottomOpacity * .5],
                type: "v4"
            },
            uTime: {
                value: 0,
            },
        },
        base: MeshBasicMaterial,
        vertex: {
            pre: glsl`
                varying vec2 vPosition;
                uniform vec4 uTopColor; 
                uniform vec4 uBottomColor; 
            `,
            main: glsl`
                vPosition = uv;
            `,
        },
        fragment: {
            pre: glsl`
                varying vec2 vPosition;
                uniform vec4 uTopColor; 
                uniform vec4 uBottomColor; 

                float easeInOutQuad(float x) {
                    return x < .5 ? 2. * x * x : 1. - pow(-2. * x + 2., 2.) / 2.;
                }
            `,
            main: glsl`   
                gl_FragColor = mix(uBottomColor, uTopColor, easeInOutQuad(vPosition.y));
            `
        }
    })
    let major = getMajorColorAt(height)
    let viewport = getCurrentViewport(camera, _position.set(...position))

    useEffect(() => {
        let bottom = palette[major].toArray()
        let top = (palette[major + 1] || palette[0]).toArray()

        return animate({
            from: {
                r1: uniforms.uBottomColor.value[0],
                g1: uniforms.uBottomColor.value[1],
                b1: uniforms.uBottomColor.value[2],
                a1: uniforms.uBottomColor.value[3],
                r2: uniforms.uTopColor.value[0],
                g2: uniforms.uTopColor.value[1],
                b2: uniforms.uTopColor.value[2],
                a2: uniforms.uTopColor.value[3],
            },
            to: {
                r1: bottom[0],
                g1: bottom[1],
                b1: bottom[2],
                a1:   bottomOpacity,
                r2: top[0],
                g2: top[1],
                b2: top[2],
                a2:  topOpacity,
            },
            render({ r1, g1, b1, a1, r2, g2, b2, a2 }) {
                uniforms.uBottomColor.value = [r1, g1, b1, a1]
                uniforms.uBottomColor.needsUpdate = true
                uniforms.uTopColor.value = [r2, g2, b2, a2]
                uniforms.uTopColor.needsUpdate = true
                scene.fog.color = _color.setRGB(r2, g2, b2)
            },
            easing: "easeOutQuad",
            duration: state === State.GAME_OVER ? 1000 : 4000,
        })
    }, [major, state]) 

    useFrame(() => {
        ref.current.position.y = camera.position.y - cameraStartY * 2
        ref.current.position.x = position[0] + camera.position.x - 10
        ref.current.position.z = position[2] + camera.position.z + 10
        ref.current.lookAt(camera.position)

        if (state === State.GAME_OVER) {
            let viewport = getCurrentViewport(camera, _position.set(...position))

            ref.current.scale.set(viewport.width * 1.1, viewport.height * 1.1, 1)
        }
    })

    return (
        <mesh
            ref={ref}
            scale={[viewport.width, viewport.height, 1]}
            material={material}
        >
            <planeBufferGeometry args={[1, 1, 1, 1]} />
        </mesh>
    )
}