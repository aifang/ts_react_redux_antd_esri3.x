import * as actionType from '../../view/oneMap/actionType'

const reduxcer = (state = null, action) => {
    switch (action.type) {
        case actionType.CREATE_MAP:
            return action.map
        default:
            return state
    }
}

export default reduxcer