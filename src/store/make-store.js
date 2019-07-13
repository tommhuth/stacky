import { createStore, applyMiddleware, compose } from "redux"
import thunkMiddleware from "redux-thunk"
import { createLogger } from "redux-logger"
import reduxPromise from "redux-promise"
import reducers from "./reducers"
 
export default function() {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
 
    return createStore(
        reducers,
        undefined,
        composeEnhancers(
            applyMiddleware(
                thunkMiddleware,
                reduxPromise,
                createLogger({ collapsed: true, predicate: (state, action) => action.type !== "stack:increment-offset" })
            )
        )
    )
}
