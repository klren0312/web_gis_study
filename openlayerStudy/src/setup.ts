import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ } from 'ol/source'
import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
import Draw from 'ol/interaction/Draw'
import { transform } from 'ol/proj'
import { LayerList } from './components/LayerList'
import TileWMS from 'ol/source/TileWMS'

export function setupMap() {
  const map = new Map({
    target: 'map'
  })
  map.setView(new View({
    center: [0, 0],
    zoom: 2
  }))

  // 创建图层列表容器
  const layerListContainer = document.createElement('div');
  layerListContainer.id = 'layer-list';
  document.getElementById('map')?.appendChild(layerListContainer);

  // 初始化图层列表
  const layerList = new LayerList(map, 'layer-list');

  // 创建底图图层
  const raster = new TileLayer({
    // source: new OSM()
    source: new XYZ({
      crossOrigin: "anonymous",
      url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
    }),
    zIndex: 0
  })
  
  // 添加底图到图层列表
  layerList.addLayer(raster, '高德地图', true);

  // 创建绘制图层
  const source = new VectorSource({wrapX: false})
  const vector = new VectorLayer({
    source
  })
  // 添加矢量图层到图层列表
  layerList.addLayer(vector, '绘制图层');

  // 添加第一个 WMS 图层
  const wmsLayer1 = new TileLayer({
    source: new TileWMS({
      url: 'http://150.109.23.64:8080/geoserver/wms',
      params: {
        'LAYERS': 'zcdc:hf',
        'TILED': true,
        'VERSION': '1.1.1',
        'SRS': 'EPSG:4326',
      },
      serverType: 'geoserver',
      projection: 'EPSG:4326'
    })
  })
  layerList.addLayer(wmsLayer1, 'WMS图层1');

  let draw: Draw | null = null
  function addInteraction() {
    draw = new Draw({
      source,
      type: 'Polygon'
    })
    map.addInteraction(draw)
    draw.on('drawend', (event) => {
      // 获取框选范围
      // 最小经度-最左边界经度
      // 最小纬度-最下边界纬度
      // 最大经度-最右边界经度
      // 最大纬度-最上边界纬度
      const extent = event.feature.getGeometry()?.getExtent()
      if (extent) {
        const leftTopJd = transform([extent[0],extent[3]], 'EPSG:3857', 'EPSG:4326')[0].toFixed(2) // 左上角x坐标（经度）
        const leftTopWd = transform([extent[0],extent[3]], 'EPSG:3857', 'EPSG:4326')[1].toFixed(2) // 左上角y坐标（纬度）
        const rightTopJd = transform([extent[2],extent[3]], 'EPSG:3857', 'EPSG:4326')[0].toFixed(2) // 右上角x坐标（经度）
        const rightTopWd = transform([extent[2],extent[3]], 'EPSG:3857', 'EPSG:4326')[1].toFixed(2) // 右上角y坐标（纬度）
        const leftBottomJd = transform([extent[0],extent[1]], 'EPSG:3857', 'EPSG:4326')[0].toFixed(2) // 左下角x坐标（经度）
        const leftBottomWd = transform([extent[0],extent[1]], 'EPSG:3857', 'EPSG:4326')[1].toFixed(2) // 左下角y坐标（纬度）
        const rightBottomJd = transform([extent[2],extent[1]], 'EPSG:3857', 'EPSG:4326')[0].toFixed(2) // 右下角x坐标（经度）
        const rightBottomWd = transform([extent[2],extent[1]], 'EPSG:3857', 'EPSG:4326')[1].toFixed(2) // 右下角y坐标（纬度）
        console.log(leftTopJd,leftTopWd,rightTopJd,rightTopWd,leftBottomJd,leftBottomWd,rightBottomJd,rightBottomWd)
      }
      console.log(extent)
      draw && map.removeInteraction(draw)
    })
  }
  
  addInteraction()
}
