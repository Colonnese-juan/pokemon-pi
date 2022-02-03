import { createStore, applyMiddleware, compose } from "redux";
import rootReducer from "../reducer";
import thunk from "redux-thunk";

const composeEnnacer = window._REDUX_DEVTOOLS_EXTENSION_COMPOSE || compose;

const store = createStore(rootReducer, composeEnnacer(applyMiddleware(thunk)));

export default store;
