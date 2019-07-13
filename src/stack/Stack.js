
import React, { useEffect } from "react"
import { useSelector } from "react-redux"
import { match, reset, start } from "../store/actions/stack"
import Fragments from "./Fragments"
import TopSlice from "./TopSlice"
import Slices from "./Slices"
import useActions from "../utils/useActions"
import { getState } from "../store/selectors/stack"
import Config from "../Config"

export default function Stack() {
    let actions = useActions({ match, reset, start })
    let state = useSelector(getState)

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

    return (
        <>
            <TopSlice />
            <Slices />
            <Fragments />
        </>
    )
}
