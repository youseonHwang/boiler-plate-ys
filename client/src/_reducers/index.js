import { combineReducers } from 'redux'; // combineReducer은 여러가지 reducer들을 RootReducer로 하나로 합쳐줌
import user from './user_reducer';
//inport comment from './comment_reducer';

const rootReducer = combineReducers({
  user
})

export default rootReducer;