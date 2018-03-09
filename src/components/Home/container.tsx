import { connect } from 'react-redux'
import HomeUI from './Home'

// interface Props {
//     map: Map
//     onClick: () => void
// }

const mapStateToProps = (state, ownProps) => ({
    map: state.map
})

// const mapDispatchToProps = (dispatch, ownProps) => ({
//     // onClick: () => {
//     //     dispatch(setHome(ownProps.map))
//     // }
// })

const container = connect(
    mapStateToProps
    // ,mapDispatchToProps
)(HomeUI)

export default container