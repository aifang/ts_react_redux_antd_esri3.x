import { connect } from 'react-redux'
// import { setHome } from './HomeAction'
import HomeUI from './Home'

// interface Props {
//     map: Map
//     onClick: () => void
// }

const mapStateToProps = (state, ownProps) => ({
    map: state.map
})

const mapDispatchToProps = (dispatch, ownProps) => ({
    // onClick: () => {
    //     dispatch(setHome(ownProps.map))
    // }
})

const Home = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomeUI)

export default Home