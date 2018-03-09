import * as React from 'react'
import MainMap from '../../components/MainMap';
import Home from '../../components/Home/HomeContainer';


// const OneMap = () => (
//     <div>
//         <MainMap />
//     </div>
// );


class OneMap extends React.Component {
    render() {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <Home/>
                <MainMap />
            </div>
        )
    }
}

export default OneMap;