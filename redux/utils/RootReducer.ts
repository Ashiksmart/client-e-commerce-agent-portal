
import { combineReducers } from "redux";
import alertsSlice from "redux/slices/common/alertsSlice";
import authSlice from "redux/slices/common/authSlice";
import countrySlice from "redux/slices/master/countrySlice";
import stateSlice from "redux/slices/master/state/stateSlice";

const RootReducer = combineReducers({
  states: stateSlice,
  auth: authSlice,
  alerts: alertsSlice,
  country: countrySlice,
});

export default RootReducer;
