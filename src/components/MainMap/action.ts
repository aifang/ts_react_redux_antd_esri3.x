import * as actionType from '../../view/oneMap/actionType'

export const creatMap = (map) => ({
    type: actionType.CREATE_MAP,
    map: map
})