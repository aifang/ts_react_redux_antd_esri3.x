// 地图引用，仅用于提示，不可直接用
import Map from "esri/map";
import Extent from "esri/geometry/Extent";
import Plygon from "esri/geometry/Polygon";
import Query from "esri/tasks/query";
import QueryTask from "esri/tasks/QueryTask";
import FeatureSet from "esri/tasks/FeatureSet";
import Point from "esri/geometry/Point";
import Polygon from "esri/geometry/Polygon";
import Graphic from "esri/graphic";
import SimpleRenderer from "esri/renderers/SimpleRenderer";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";
import ArcGISDynamicMapServiceLayer from "esri/layers/ArcGISDynamicMapServiceLayer";
import FeatureLayer from "esri/layers/FeatureLayer";
import HeatmapRenderer from "esri/renderers/HeatmapRenderer";
import GraphicsLayer from "esri/layers/GraphicsLayer";

// 真实代码引用
import * as React from 'react';
import esriLoader from 'esri-loader';
import { creatMap } from './MainMapAction';



//#region--------------全局变量------------------------
let _lang, _on, _mapUtils, _Extent, _require, _Graphic, _JsonUtils, _FeatureLayer, _ArcGISDynamicMapServiceLayer
let _map: Map



//#endregion



interface Props {
    // onCreatedMap?:()=>void
    dispatch
}

interface State {

}

/**
 * 主地图
 */
export default class MainMap extends React.Component<Props, State> {

    //初始化属性
    // static defaultProps = {
    //     // initParam: {}
    // }

    //#region ----------------------内部全局变量---------------------

    _mapDom: HTMLDivElement
    _handles = []
    _dojoState
    //#endregion


    //#region ----------------------组件生命周期---------------------

    constructor(props: Props) {
        super(props);
        this.state = {
            drawToolVisible: false,
            heatmap: { show: false }
        };
        // notification.config({
        //     placement: 'bottomRight'
        // });
    }

    componentDidMount() {

        // this.openNotification('进入 市场主体分析 页面\n得到初始化参数：' + JSON.stringify(this.props.match.params.initData))

        // 载入地图模块, "dojo/promise/all"
        esriLoader.loadModules([
            'require', 'gis/common/mapUtils', 'dojo/_base/lang', 'dojo/on', "dojo/Stateful",
            'esri/geometry/Extent', 'esri/geometry/jsonUtils', 'esri/graphic', 'esri/layers/FeatureLayer', 'esri/layers/ArcGISDynamicMapServiceLayer'
        ], window['dojoOpt'])
            .then(([
                require, mapUtils, lang, on, Stateful,
                extent, jsonUtils, graphic, FeatureLayer,ArcGISDynamicMapServiceLayer
            ]) => {
                _lang = lang
                _mapUtils = mapUtils
                _Extent = extent
                _on = on
                _require = require
                _JsonUtils = jsonUtils
                _Graphic = graphic
                _FeatureLayer = FeatureLayer
                _ArcGISDynamicMapServiceLayer = ArcGISDynamicMapServiceLayer
                this.startMap()
                // this._handles.push(_on(window, 'message', this.handleMessage))
                // this._dojoState = new Stateful({})
                // this._dojoState.watch('keyLayerSql', (name, old, value) => { this.setEnterpriseDefinition(value) })
            })
            .catch(err => {
                console.log(err)
            })
    }

    componentWillUnmount() {
        console.log('mainMap component Will Unmount')
        this._handles.forEach(n => n.remove())
        _map && _map.destroy()
    }

    //#endregion


    //#region ----------------------方法---------------------

    startMap() {
        let map = _map;
        map = _mapUtils.initMap(this._mapDom);
        map.addLayer(new _ArcGISDynamicMapServiceLayer('http://localhost:6080/arcgis/rest/services/bigData/xzq_white/MapServer', { id: '行政区图' }))
        // window['gismap'] = _map
        this.props.dispatch(creatMap(map))
    }


    //#endregion

    render() {
        return (
            // <div className="sliderMap mapApp">
                <div className="esriMap" ref={(e) => this._mapDom = e} />
            // </div>
        );
    }
}




