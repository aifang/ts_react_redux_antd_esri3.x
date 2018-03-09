const setHome = (state = {}, action) => {
    switch (action.type) {
        case 'SET_HOME':
            let cc = Object.assign({}, state)
            console.log(cc)
            return cc
        default:
            return state
    }
}

export default setHome
