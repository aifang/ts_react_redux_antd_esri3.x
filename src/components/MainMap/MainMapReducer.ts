const mainMap = (state = null, action) => {
    switch (action.type) {
        case 'CREATE_MAP':
            return action.map
        default:
            return state
    }
}

export default mainMap