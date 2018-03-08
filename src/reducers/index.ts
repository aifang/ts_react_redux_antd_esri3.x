import { combineReducers } from 'redux'
import todos from './todos'
import visibilityFilter from './visibilityFilter'
import setHome from '../components/Home/HomeReducers'

const todoApp = combineReducers({
  todos,
  visibilityFilter,
  setHome
})

export default todoApp