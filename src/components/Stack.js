
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { match, reset, start } from "../store/actions/stack"
import Fragments from "./Fragments"
import TopSlice from "./TopSlice"
import Slices from "./Slices"
import useActions from "../utils/useActions"
import { getState, getStackSize } from "../store/selectors/stack"
import Config from "../Config"
import { useThree } from "react-three-fiber"
import ColorMixer from "../utils/ColorMixer"
import anime from "animejs"

export default function Stack() {
    let actions = useActions({ match, reset, start })
    let state = useSelector(getState)
    let stackSize = useSelector(getStackSize)
    let { scene } = useThree()

    useEffect(() => {
        function onClick(e) {
            e.preventDefault()

            switch (state) {
                case Config.STATE_READY:
                    return actions.start()
                case Config.STATE_ACTIVE:
                    return actions.match()
                case Config.STATE_GAME_OVER:
                    return actions.reset()
            }
        }

        let root = document.getElementById("root")

        root.addEventListener("click", onClick)
        root.addEventListener("touchstart", onClick)

        return () => {
            root.removeEventListener("click", onClick)
            root.removeEventListener("touchstart", onClick)
        }
    }, [state])

    useEffect(() => {
        let color = ColorMixer.colors[ColorMixer.i - 1]

        anime({
            targets: scene.fog.color,
            r: color.r,
            g: color.g,
            b: color.b,
            duration: 1500,
            easing: "easeOutCubic",
            autoplay: true
        })
    }, [stackSize])

    return (
        <>
            <TopSlice />
            <Slices />
            <Fragments />
        </>
    )
}
