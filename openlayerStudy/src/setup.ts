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
    // 将中心点设置为中国中心位置（东经105度，北纬35度）
    center: transform([105, 35], 'EPSG:4326', 'EPSG:3857'),
    // 调整缩放级别以更好地显示中国
    zoom: 5
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

  // 添加第一个 WMS 图层
  const wmsLayer1 = new TileLayer({
    source: new TileWMS({
      url: 'http://150.109.23.64:8080/geoserver/wms',
      params: {
        'LAYERS': 'zcdc:hf',
        'TILED': true,
        'VERSION': '1.1.1',
        'SRS': 'EPSG:4326'
      },
      serverType: 'geoserver',
      projection: 'EPSG:4326'
    })
  })
  layerList.addLayer(wmsLayer1, '合肥图层');

  // 添加第二个 WMS 图层
  const wmsLayer2 = new TileLayer({
    source: new TileWMS({
      url: 'http://150.109.23.64:8080/geoserver/wms',
      params: {
        'LAYERS': 'zcdc:xjxjxj',
        'TILED': true,
        'VERSION': '1.1.1',
        'SRS': 'EPSG:4326'
      },
      serverType: 'geoserver',
      projection: 'EPSG:4326'
    })
  })
  layerList.addLayer(wmsLayer2, '新疆图层');



  // 添加地上生物量碳密度2010图层
  const biomassLayer = new TileLayer({
    source: new XYZ({
      url: 'https://unbl-prod-tiles-cdn.azureedge.net/$web/assets/map-tiles/046da733-420f-469b-905d-0dadeaf8df2d/{z}/{x}/{y}/tile_unblbiomasscarbondensityabovegroundMGABCwcomposite20091231T00:00:00.000Z20101231T00:00:00.000Z.png',
      crossOrigin: 'anonymous'
    }),
    opacity: 0.7  // 设置透明度，可以根据需要调整
  });
  layerList.addLayer(biomassLayer, '地上生物量碳密度2010', false, false);

  // 添加医疗保健可及性图层
  const healthcareLayer = new TileLayer({
    source: new XYZ({
      url: 'https://unbl-prod-tiles-cdn.azureedge.net/$web/assets/map-tiles/fef948f7-4fdb-4973-ad53-c22f8db11240/{z}/{x}/{y}/tile_accessibilitytohealthcareh9Eknaccessibility_to_healthcare_2019_all20190101T00:00:00.000Z20191231T00:00:00.000Z.png',
      crossOrigin: 'anonymous'
    }),
    opacity: 0.7
  });
  layerList.addLayer(healthcareLayer, '医疗保健可及性2019', false, false);

  // 添加土地生产力图层
  const landProductivityLayer = new TileLayer({
    source: new TileWMS({
      url: 'https://sdgdata.casearth.cn/geoserver/SDG/wms',
      params: {
        'LAYERS': '全球土地生产力2015',
        'TILED': true,
        'VERSION': '1.3.0',
        'FORMAT': 'image/png',
        'TRANSPARENT': true
      },
      serverType: 'geoserver'
    }),
    opacity: 0.7
  });
  layerList.addLayer(landProductivityLayer, '全球土地生产力2015', false, false);

  // 添加夜间灯光图层
  const nightLightLayer = new TileLayer({
    source: new XYZ({
      url: 'https://unbl-prod-tiles-cdn.azureedge.net/$web/assets/map-tiles/84db30b3-0775-4a0c-9f1a-f0e8b9868ca0/{z}/{x}/{y}/tile_unblHarmonizedDNNTLcalDMSPt2zU9composite20180101T00:00:00.000Z20190101T00:00:00.000Z.png',
      crossOrigin: 'anonymous'
    }),
    opacity: 1
  });
  layerList.addLayer(nightLightLayer, '夜间灯光2018', false, false);

  // 添加土地覆盖图层
  const landCoverLayer = new TileLayer({
    source: new XYZ({
      url: 'https://unbl-prod-tiles-cdn.azureedge.net/$web/assets/map-tiles/e51e5d6a-8651-47ca-a77d-2e54b20df09e/{z}/{x}/{y}/tile_esacci9IGzZwcomposite20220101T00:00:00.000Z20221231T00:00:00.000Z.png',
      crossOrigin: 'anonymous'
    }),
    opacity: 0.7
  });
  layerList.addLayer(landCoverLayer, '土地覆盖2022', false, false);

  // 添加生态完整性指数图层
  const ecologicalLayer = new TileLayer({
    source: new XYZ({
      url: 'https://unbl-prod-tiles-cdn.azureedge.net/$web/assets/map-tiles/03970ce6-4d57-4d84-82b3-e42d553a5368/{z}/{x}/{y}/tile_ecologicalintactnessindex8zbcUNeii20230101T00:00:00.000Z20231231T00:00:00.000Z.png',
      crossOrigin: 'anonymous'
    }),
    opacity: 0.7
  });
  layerList.addLayer(ecologicalLayer, '生态完整性指数2023');

  // addDraw(layerList, map)
}

/**
 * 添加绘图图层
 * @param layerList 
 * @param map 
 */
function addDraw(layerList:  LayerList, map: Map) {
  // 创建绘制图层
  const source = new VectorSource({wrapX: false})
  const vector = new VectorLayer({
    source
  })
  // 添加矢量图层到图层列表
  layerList.addLayer(vector, '绘制图层');

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
