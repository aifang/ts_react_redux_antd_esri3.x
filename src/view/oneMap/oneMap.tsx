import * as React from 'react'
import MainMap from '../../components/MainMap';
import Home from '../../components/Home/Home';


// const OneMap = () => (
//     <div>
//         <MainMap />
//     </div>
// );


class OneMap extends React.Component {
    render() {
        return (
            <div style={{ height: '100%', width: '100%' }}>
                <Home map={null} onClick={null}/>
                <MainMap />
            </div>
        )
    }
}

export default OneMap;