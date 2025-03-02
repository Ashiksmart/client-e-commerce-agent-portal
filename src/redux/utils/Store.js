import { createStore, applyMiddleware } from 'redux';
import rootReducer from './RootReducer'; // Create this file next
import thunk from "redux-thunk";

const middleWare = [thunk];

const store = createStore(
    rootReducer,
    applyMiddleware(...middleWare),
);

export default store;
