import { combineReducers } from 'redux';
import userDetailsReducer from '../slice/userDetailsSlice';

const rootReducer = combineReducers({
  userDetails: userDetailsReducer,
});

export default rootReducer;
