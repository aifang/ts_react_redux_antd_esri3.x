import { combineReducers } from 'redux'
import map from '../../components/MainMap/MainMapReducer'

const todoApp = combineReducers({
    map
})

export default todoApp