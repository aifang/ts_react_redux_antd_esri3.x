const setHome = (state = null, action) => {
    switch (action.type) {
        case 'SET_HOME':
            return action.map
        default:
            return state
    }
}

export default setHome
