import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import RootReducer from "./RootReducer";

const middleWare = [thunk];

const Store = createStore(RootReducer, applyMiddleware(...middleWare));

export default Store;
