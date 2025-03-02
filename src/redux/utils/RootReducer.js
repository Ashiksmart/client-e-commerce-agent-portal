import { combineReducers } from "redux";
import storeDataReducers from "../slices/store";
const {store, pageData , AccountInfo} = storeDataReducers
const rootReducer = combineReducers({
  store,
  pageData,
  AccountInfo
});

export default rootReducer;
