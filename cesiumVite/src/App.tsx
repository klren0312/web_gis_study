import { useEffect, useRef, useState } from 'react'
import {
  Viewer,
  WebMapTileServiceImageryProvider,
  GeographicTilingScheme,
  Cartesian3,
  Moon
} from 'cesium'

import './App.css'
import {
  DistanceSurfaceMeasure,
  AreaSurfaceMeasure,
  Measure
} from '@cesium-extends/measure'

import Compass from '@cesium-extends/compass'
import ZoomController from '@cesium-extends/zoom-control'

const measureOptions: {
  label: string;
  key: string;
  tool: typeof Measure;
}[] = [
  {
    label: '距离测量(贴地)',
    key: 'SurfaceDistance',
    tool: DistanceSurfaceMeasure,
  },
  {
    label: '面积测量(贴地)',
    key: 'SurfaceArea',
    tool: AreaSurfaceMeasure,
  },
]


function App() {
  const viewer = useRef<Viewer>()
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const measure = useRef<Measure>()
  const compass = useRef<Compass>()
  const zoomController = useRef<ZoomController>()

  const addGaodeLayer = () => {
    if (!viewer.current) {
      return
    }
    viewer.current.imageryLayers.addImageryProvider(new WebMapTileServiceImageryProvider({
      url: 'https://trek.nasa.gov/tiles/Mars/EQ/Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw/1.0.0/{Style}/{TileMatrixSet}/{TileMatrix}/{TileRow}/{TileCol}.png',
      layer: 'Mars_MOLA_blend200ppx_HRSC_Shade_clon0dd_200mpp_lzw',
      style: 'default',
      format: 'image/png',
      tileMatrixSetID: 'default028mm',
      maximumLevel: 6,
      tilingScheme: new GeographicTilingScheme(),
    }))
  }

  /**
   * 切换工具
   * name 工具 key名称
   * tool 工具组件
   */
  const onChangeTool = (
    name: string | null,
    Tool: typeof Measure | null = null,
  ) => {
    if (!viewer || !viewer.current) return
  
    // 销毁上一个工具
    if (measure.current) {
      measure.current.destroy()
      measure.current = undefined
    }
    const newToolName = activeTool === name ? null : name
    // 设置当前使用的工具
    setActiveTool(newToolName)
  
    if (newToolName && Tool) {
      // 初始化工具
      measure.current = new Tool(viewer.current, {
        units: 'kilometers',
        locale: {
          start: '起点',
          area: '面积',
          total: '总计',
          formatLength: (length, unitedLength) => {
            if (length < 1000) {
              return length + '米'
            }
            return unitedLength + '千米'
          },
          formatArea: (area, unitedArea) => {
            if (area < 1000000) {
              return area + '平方米'
            }
            return unitedArea + '平方千米'
          },
        },
        drawerOptions: {
          tips: {
            init: '点击绘制',
            start: '左键添加点，右键移除点，双击结束绘制',
          },
        },
      })
      measure.current.start()
    }
  }

  /**
   * 清除工具
   */
  const clear = () => {
    measure.current?.end()
  }

  /**
   * 初始化cesium
   */
  const initCesium = async () => {
    viewer.current = new Viewer('cesium-container',{
      selectionIndicator: false,
      baseLayer: false,
      baseLayerPicker:false,
      sceneModePicker:false,
      navigationHelpButton:false,
      homeButton:true,
      skyBox:false,
      infoBox:false,
      timeline:false,
      animation:false,
      vrButton:false,
      geocoder:false,
      fullscreenButton:false,
      navigationInstructionsInitiallyVisible:false,
      shouldAnimate:true,
      creditContainer: document.createElement('div'),
    })
    viewer.current.scene.moon = new Moon()

    compass.current = new Compass(viewer.current)
    zoomController.current = new ZoomController(viewer.current, {
      container: document.getElementById('cesium-container') as Element,
      home: Cartesian3.fromDegrees(-98.57, 39.82, 5000000),
      tips: {
        zoomIn: '放大',
        zoomOut: '缩小',
        refresh: '重置缩放',
      },
    })
    addGaodeLayer()
  }

  /**
   * 初始化
   */
  useEffect(() => {
    initCesium()
    return () => {
      measure.current?.destroy()
      measure.current = undefined
      compass.current?.destroy()
      compass.current = undefined
      viewer.current?.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div id="cesium-container">
      <div className="draw-tools">
        {measureOptions.map((item) => (
          <button
            key={item.key}
            onClick={() => onChangeTool(item.key, item.tool)}
          >
            {item.label}
          </button>
        ))}
        <button onClick={clear}>清除</button>
      </div>
    </div>
  )
}

export default App
