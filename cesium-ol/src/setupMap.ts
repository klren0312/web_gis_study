import Map from 'ol/Map'
import View from 'ol/View'
import { XYZ } from 'ol/source'
import TileLayer from 'ol/layer/Tile'
import VectorSource from 'ol/source/Vector'
import VectorLayer from 'ol/layer/Vector'
// @ts-ignore
import OLCesium from 'olcs'

export function setup() {
  const raster = new TileLayer({
    // source: new OSM()
    source: new XYZ({
      crossOrigin: "anonymous",
      url: "https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}"
    })
  })
  const vectorSource = new VectorSource({wrapX: false})
  const vector = new VectorLayer({
    source: vectorSource
  })
  const map = new Map({
    target: 'map',
    view: new View({
      center: [0, 0],
      zoom: 2
    }),
    layers: [raster, vector]
  })

  const ol3d = new OLCesium({ map })
  ol3d.setEnabled(true)
}
