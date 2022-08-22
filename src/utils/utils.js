import { createContext } from "react"
   
export function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num
}  


export function map(value, inMin, inMax, outMin, outMax) {
    return clamp((value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin, outMin, outMax)
}


export function Only(props) {
    return props.if ? <>{props.children}</> : null
}
 
// Source: https://medium.com/@Heydon/managing-heading-levels-in-design-systems-18be9a746fa3
const Level = createContext(1)

export function Section({ children }) {
    return (
        <Level.Consumer>
            {level => <Level.Provider value={level + 1}>{children}</Level.Provider>}
        </Level.Consumer>
    )
}

export function Heading(props) {
    return (
        <Level.Consumer>
            {level => {
                let Component = `h${Math.min(level, 6)}`

                return <Component {...props} />
            }}
        </Level.Consumer>
    )
}

export function glsl(t) {
    for (var o = [t[0]], i = 1, l = arguments.length; i < l; i++) {
        o.push(arguments[i], t[i])
    }

    return o.join("")
}