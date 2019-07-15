
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
import { Color } from "three"
import anime from "animejs"

export default function Stack() {
    let actions = useActions({ match, reset, start })
    let state = useSelector(getState)
    let stackSize = useSelector(getStackSize)
    let { scene } = useThree()

    useEffect(() => {
        function onClick() {
            switch (state) {
                case Config.STATE_READY:
                    return actions.start()
                case Config.STATE_ACTIVE:
                    return actions.match()
                case Config.STATE_GAME_OVER:
                    return actions.reset()
            }
        }

        window.addEventListener("click", onClick)

        return () => window.removeEventListener("click", onClick)
    }, [state])

    useEffect(() => {
        let next = ColorMixer.previous().multiply(new Color(.5, .5, .5))

        anime({
            targets: scene.fog.color,
            r: next.r,
            g: next.g,
            b: next.b,
            duration: 500,
            easing: "easeOutCubic",
            autoplay: true
        }) 

        ColorMixer.setEnvironment()
    }, [stackSize])

    return (
        <>
            <TopSlice />
            <Slices />
            <Fragments />
        </>
    )
}
