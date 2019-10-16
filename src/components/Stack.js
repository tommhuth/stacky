import React, { useEffect } from "react" 
import Fragments from "./Fragments"
import TopSlice from "./TopSlice"
import Slices from "./Slices" 
import { useStore } from "../data/store"
import Config from "../Config" 

export default function Stack() {
    let restart = useStore(state => state.restart)
    let match = useStore(state => state.match)
    let start = useStore(state => state.start)
    let state = useStore(state => state.state) 
    let clean = useStore(state => state.clean) 

    useEffect(() => {
        function onClick(e) {
            e.preventDefault()

            switch (state) {
                case Config.STATE_READY:
                    return start()
                case Config.STATE_ACTIVE:
                    return match()
                case Config.STATE_GAME_OVER:
                    return restart()
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
 
    return (
        <>
            <TopSlice />
            <Slices />
            <Fragments />
        </>
    )
}
