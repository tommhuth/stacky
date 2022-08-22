import { useState, useMemo } from "react" 
import { MeshPhongMaterial } from "three"
import { glsl } from "./utils"

export function useShader({
    base = MeshPhongMaterial,
    vertex,
    fragment,
    uniforms: incomingUniforms = {},
    ...rest
}) {
    let [uniforms] = useState(() => {  
        return incomingUniforms
    })
    let material = useMemo(() => {
        return new base({
            ...rest,
            onBeforeCompile(shader) {
                shader.uniforms = {
                    ...shader.uniforms,
                    ...uniforms
                }
                shader.vertexShader = shader.vertexShader.replace("#include <common>", glsl`
                    #include <common>
             
                    ${vertex?.pre || ""}  
                `)
                shader.vertexShader = shader.vertexShader.replace("#include <begin_vertex>", glsl`
                    #include <begin_vertex>
            
                    ${vertex?.main || ""}  
                `)
                shader.fragmentShader = shader.fragmentShader.replace("#include <common>", glsl`
                    #include <common>

                    ${fragment?.pre || ""}  
                `)
                shader.fragmentShader = shader.fragmentShader.replace("#include <dithering_fragment>", glsl`
                    ${fragment?.main || ""}  

                    #include <dithering_fragment> 
                `)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vertex?.pre, vertex?.main, fragment?.pre, fragment?.main, uniforms, base])

    return [material, uniforms]
}