import { bindActionCreators } from "redux"
import { useDispatch } from "react-redux"
import { useMemo } from "react"

export default function useActions(actions = {}, deps = []) {
    const dispatch = useDispatch()

    return useMemo(() => {
        let result = {}

        for (let action of Object.keys(actions)) {
            result[action] = bindActionCreators(actions[action], dispatch)
        } 
        
        return result
    }, [dispatch, ...deps])
}
