import Map = require("esri/map")
import Extent = require("esri/geometry/Extent")
import ArcGISDynamicMapServiceLayer = require("esri/layers/ArcGISDynamicMapServiceLayer")
import ArcGISTiledMapServiceLayer = require("esri/layers/ArcGISTiledMapServiceLayer")
import Layer = require("esri/layers/layer")
import GraphicsLayer = require("esri/layers/GraphicsLayer")
import SpatialReference = require("esri/SpatialReference")
import PictureMarkerSymbol = require('esri/symbols/PictureMarkerSymbol')
import SimpleMarkerSymbol = require('esri/symbols/SimpleMarkerSymbol')
import SimpleFillSymbol = require("esri/symbols/SimpleFillSymbol")
import SimpleLineSymbol = require("esri/symbols/SimpleLineSymbol")
import Symbol = require("esri/symbols/Symbol")
import Color = require("esri/Color")
import esri from 'esri'
import Graphic = require("esri/graphic")
import LayerList = require("esri/dijit/LayerList")
import QueryTask = require("esri/tasks/QueryTask")
import Query = require("esri/tasks/query")
import FindTask = require("esri/tasks/FindTask")
import FindParameters = require("esri/tasks/FindParameters")
import StatisticDefinition = require("esri/tasks/StatisticDefinition")
import FeatureLayer = require("esri/layers/FeatureLayer")
import HeatmapRenderer = require("esri/renderers/HeatmapRenderer")

// import config = require("../../config/mapConfig")

import lang = require("dojo/_base/lang")

let config

class MapUtils {
    static map: Map
    static pageName: string

    static initMap(divId = 'mapDiv', options?: esri.MapOptions) {
        var defaultOpt = { divId: divId, options: { lods: config.lods, logo: false, zoom: 0, slider: false, showLabels: true } };
        lang.mixin(defaultOpt.options, options);
        if (defaultOpt.options.zoom === -1) delete defaultOpt.options.zoom;
        var map = new Map(defaultOpt.divId, defaultOpt.options as esri.MapOptions)
        return map;
    }

    /** 根据mapconfig加载图层,逐个加载，并获取查询子图层id*/
    static loadMapServerLayers(layers: object[], map = this.map) {
        layers.forEach(lyrOpt => {
            let opt: any = {}, lyrData: any = {};
            let lyr: ArcGISDynamicMapServiceLayer | ArcGISTiledMapServiceLayer
            for (const key in lyrOpt) {
                if (lyrOpt.hasOwnProperty(key)) opt[key] = lyrOpt[key];
                /**获取图层详细配置 */
                lyrData = config.layers[opt.name]
                if (!lyrData) { console.log('加载图层时，未在配置文件中找到图层：' + opt.name); return; }

                opt.id = lyrData.text;
            }
            switch (lyrData.type) {
                case 'tile':
                    lyr = new ArcGISTiledMapServiceLayer(lyrData.url, opt)
                    break;
                default:
                    lyr = new ArcGISDynamicMapServiceLayer(lyrData.url, opt)
                    break;
            }
            lyr.on('load', evt => {
                lyrData.lyr = evt.layer
                for (const key in lyrData.sublayerIds) {
                    if (lyrData.sublayerIds.hasOwnProperty(key)) {
                        lyrData.sublayerIds[key] = this.getSubLayerIdFromMapServer(evt.layer, lyrData.sublayerIds[key]);
                    }
                }
                // console.log(config.layers) 
            })
            map.addLayer(lyr);
        });
    }

    static initLayerList(divId = 'layerList', opt?, map = this.map, exceptLyrIds = []) {
        let opt_temp = {
            map: map,
            showLegend: true,
            showOpacitySlider: true,
            layers: []
        }
        lang.mixin(opt_temp, opt);
        if (exceptLyrIds.length) {
            map.layerIds.forEach(n => {
                if (exceptLyrIds.indexOf(n) === -1)
                    opt_temp.layers.push({
                        layer: map.getLayer(n),
                        showSubLayers: true,
                        showLegend: true,
                        showOpacitySlider: true,
                        // visibility: false,
                        id: map.getLayer(n).id
                    })
            })
            map.graphicsLayerIds.forEach(n => {
            if (exceptLyrIds.indexOf(n) === -1)
                    opt_temp.layers.push({
                        layer: map.getLayer(n),
                        // showSubLayers: true,
                        // showLegend: true,
                        showOpacitySlider: true,
                        // visibility: false,
                        id: map.getLayer(n).id
                    })
            })
        }
        var myWidget = new LayerList(opt_temp, divId);
        myWidget.startup();
        return myWidget;
    }

    static getQueryTask(url) {
        if (!url) { console.warn("url=" + url + "无法生成queryTask"); return; }
        return new QueryTask(url);
    }

    static getQuery(options?) {
        let query = new Query();
        lang.mixin(query, options)
        return query
    }

    static getFindTask(url) {
        if (!url) { console.warn("url=" + url + "无法生成queryTask"); return; }
        return new FindTask(url);
    }

    static getFindParameters(options?) {
        let query = new FindParameters();
        lang.mixin(query, options)
        return query
    }

    static getStatisticDefinition(type, field) {
        if (!(type && field)) { console.warn('StatisticDefinition 缺少参数'); return; }
        var statDef = new StatisticDefinition();
        statDef.statisticType = type;
        statDef.onStatisticField = field;
        statDef.outStatisticFieldName = type;
        return statDef;
    }


    /**获取查询图层 */
    static getImportantLayers(layers, map = this.map) {
        let lyrEntities = {};
        for (let lyrName in layers) {
            if (layers.hasOwnProperty(lyrName)) {
                let entity = MapUtils.getLayerIdFromLoadLayers(lyrName);
                for (let sublyr in entity.sublayerIds) {
                    if (entity.sublayerIds.hasOwnProperty(sublyr)) {
                        let subLayerName = entity.sublayerIds[sublyr];
                        entity.sublayerIds[sublyr] = MapUtils.getSubLayerIdFromMapServer(entity.lyr as ArcGISDynamicMapServiceLayer | ArcGISTiledMapServiceLayer, subLayerName);
                    }
                }
                lyrEntities[lyrName] = entity;
            }
        }
        return lyrEntities;
    }

    static getGraphicsLayer(opt?: esri.GraphicsLayerOptions) {
        return new GraphicsLayer(opt)
    }

    static getFeatureLayer(url: string | object, opt?: esri.FeatureLayerOptions) {
        return new FeatureLayer(url, opt)
    }



    /**设置高亮事件 */
    static setGraphicLayerMouseEvent(lyr: GraphicsLayer, overSymbol?, outSymbol?) {
        lyr.on('mouse-over', (evt) => {
            this.exchangeGraphicsSymbol(evt.graphic, overSymbol);//#00FFFF 水蓝色
        });
        lyr.on('mouse-out', (evt) => {
            this.exchangeGraphicsSymbol(evt.graphic, outSymbol);//#FF0000 红色
        });
    }




    /**
     * 设置GraphicsLayer默认的符号根据添加的geometry类型添加
     * 默认simpleSymbol
     * pictureSymbol直接传入 symbol参数
     */
    static setGraphicLayerDefaultSymbol(lyr: GraphicsLayer, symbol?) {
        let pHandle = lyr.on('graphic-add', (evt) => {
            let gra = evt.graphic;
            if (symbol) { gra.setSymbol(symbol); return; }
            if (gra.symbol) return;
            let mySym
            switch (gra.geometry.type) {
                case 'polygon':
                case 'extent':
                    mySym = this.getFillSymbol();
                    break;
                case 'polyline':
                    mySym = this.getLineSymbol()
                    break;
                case 'point':
                    mySym = this.getMarkerSymbol() //pictureMarkerSymbol请直接传入symbol
                    break;
                default:
                    break;
            }
            gra.setSymbol(mySym);
        });
        return pHandle;
    }

    /**获取默认显示的面符号 */
    static getFillSymbol(style: string = SimpleFillSymbol.STYLE_SOLID, outline: SimpleLineSymbol = this.getLineSymbol(), color: any = [255, 0, 0, 0]) {
        var sfs = new SimpleFillSymbol().setColor(new Color([255, 0, 0, 0])).setOutline(outline) as SimpleFillSymbol;//直接设置STYLE_null mouseover事件只能摸边
        if (style !== SimpleFillSymbol.STYLE_SOLID)
            sfs.setStyle(style)
        return sfs
    }


    /**获取默认显示的线符号 */
    static getLineSymbol(style = SimpleLineSymbol.STYLE_SOLID, color: string | number[] | object = '#FF0000', width = 2) {
        var sls: SimpleLineSymbol = new SimpleLineSymbol().setStyle(style).setColor(new Color(color))['setWidth'](width);
        return sls
    }

    /**获取默认显示的标注符号 */
    static getMarkerSymbol(style = SimpleMarkerSymbol.STYLE_CIRCLE, size = 15, outline: SimpleLineSymbol = this.getLineSymbol(SimpleLineSymbol.STYLE_SOLID, [255, 127, 127, 1], 3), color: any = [255, 0, 0, 1]) {
        var marker = new SimpleMarkerSymbol(style, size, outline, color);
        // let marker = new SimpleMarkerSymbol(JSON.parse('{"color":[255,0,0,255],"size":11.25,"angle":0,"xoffset":0,"yoffset":0,"type":"esriSMS","style":"esriSMSCircle","outline":{"color":[255,127,127,255],"width":2.25,"type":"esriSLS","style":"esriSLSSolid"}}'));
        return marker
    }

    /**获取默认显示的图片标注符号 */
    static getPictureMakerSymbol(url: string = require['toUrl']('image/symbol/PointRed.png'), width = 21, height = 33) {
        let pSym = new PictureMarkerSymbol(url, width, height)
        return pSym
    }

    static calculateHeatmapMaxPixelIntensity = (lyr: FeatureLayer, refresh = false, times = 2) => {
        let heatmapRenderer = lyr.renderer as HeatmapRenderer;
        lyr.queryFeatures({ outStatistics: [MapUtils.getStatisticDefinition('max', heatmapRenderer.field), MapUtils.getStatisticDefinition('stddev', heatmapRenderer.field)] } as Query)
            .then((statRes) => {
                if (statRes.features.length > 0) {
                    var stats = statRes.features[0].attributes;
                    var maxPixel = (stats.MAX || stats.max) - (stats.STDDEV || stats.stddev);
                    if (maxPixel) {
                        heatmapRenderer.maxPixelIntensity = maxPixel * times;
                    }
                    refresh && lyr.redraw()
                }
            })
    }

    // static creat




    //------------------------------私有方法---------------------------------------

    /**一般情况下高亮要素颜色切换 */
    private static exchangeGraphicsSymbol(gra: Graphic, pSym?: Symbol) {

        //优先级1
        if (pSym) {
            let tmpSym = gra.symbol;
            gra.setSymbol(pSym);
            gra['beforeSymbol'] = tmpSym;
            return;
        }

        //优先级2
        if (gra['beforeSymbol']) {
            let tmpSym = gra.symbol;
            gra.setSymbol(gra['beforeSymbol']);
            gra['beforeSymbol'] = tmpSym;
            return
        }

        //优先级3
        let mySym
        switch (gra.geometry.type) {
            case 'polygon':
            case 'extent':
                mySym = MapUtils.getFillSymbol();
                mySym.outline.setColor(new Color('#00FFFF'))
                break;
            case 'polyline':
                mySym = MapUtils.getLineSymbol()
                mySym.setColor(new Color('#00FFFF'))
                break;
            case 'point':
                mySym = gra.symbol.type === 'simplemarkersymbol' ? MapUtils.getMarkerSymbol('circle', 28, MapUtils.getLineSymbol('solid', [0, 92, 230, 0.3137], 11), [0, 112, 255, 1]) : MapUtils.getPictureMakerSymbol(require['toUrl']('image/symbol/PointBlue.png')).setOffset(0, 15)
                break;
            default:
                break;
        }

        let tmpSym = gra.symbol;
        gra.setSymbol(mySym);
        gra['beforeSymbol'] = tmpSym;
    }

    private static getLayerIdFromLoadLayers(rgxstr, map = this.map, pageName = this.pageName) {
        let regExp = new RegExp(rgxstr, 'i');
        let arr = config.pageInfos[pageName].loadLayers.filter(function (item) {
            return regExp.test(item.name);
        });
        if (arr.length) {
            let lyrInfo = config.layers[arr[0].name];
            return { lyr: map.getLayer(lyrInfo.text), sublayerIds: lyrInfo.sublayerIds };
        } else {
            console.warn('未能在mapconfig.Infos.' + pageName + '.loadLayers找到' + rgxstr + '地图,请修改配置');
            return;
        }
    }

    /**根据子图层名称，得到对应的id */
    private static getSubLayerIdFromMapServer(serverlayer: ArcGISDynamicMapServiceLayer | ArcGISTiledMapServiceLayer, subLayerName) {
        if (serverlayer.hasOwnProperty('layerInfos')) {
            let index = -1;
            serverlayer.layerInfos.forEach(function (item) {
                if (item.name === subLayerName) {
                    if (index !== -1) {
                        console.warn('出现多个一样名字一样的图层 ：' + subLayerName + ' layerId 为' + index + ',' + item.id);
                    }
                    index = item.id;
                }
            });
            return index;
        }
    }
}

export =MapUtils;