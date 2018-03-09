import { combineReducers } from 'redux'
import { reducer as MainReducer } from '../../components/MainMap';

const reducers = combineReducers({
    map: MainReducer
})

export default reducers