import { useEffect, useRef, useState } from 'react'
import {
  Cartesian3,
  CesiumTerrainProvider,
  Viewer,
  Math as CMath,
  Ion,
  UrlTemplateImageryProvider
} from 'cesium'

import './App.css'
import {
  DistanceMeasure,
  DistanceSurfaceMeasure,
  AreaMeasure,
  AreaSurfaceMeasure,
  Measure
} from '@cesium-extends/measure'

const measureOptions: {
  label: string;
  key: string;
  tool: typeof Measure;
}[] = [
  {
    label: '距离测量',
    key: 'Distance',
    tool: DistanceMeasure,
  },
  {
    label: '距离测量(贴地)',
    key: 'SurfaceDistance',
    tool: DistanceSurfaceMeasure,
  },
  {
    label: '面积测量',
    key: 'Area',
    tool: AreaMeasure,
  },
  {
    label: '面积测量(贴地)',
    key: 'SurfaceArea',
    tool: AreaSurfaceMeasure,
  },
]


function App() {
  Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxODJjZDA0MS1kYzNkLTQ1NDEtOGUwYS1iOTA4NGQ2NTc5ZTciLCJpZCI6MjUxOTA0LCJpYXQiOjE3MzAzNDQ3NDh9.wi_r3YgME8d6-U9EEfZqwdhI02ZwboBUpmzXZC-Wai8'
  const viewer = useRef<Viewer>()
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const measure = useRef<Measure>()

  const addGaodeLayer = () => {
    if (!viewer.current) {
      return
    }
    // 底图
    viewer.current.imageryLayers.addImageryProvider(
      new UrlTemplateImageryProvider({
        url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      })
    )
    // 标注
    viewer.current.imageryLayers.addImageryProvider(
      new UrlTemplateImageryProvider({
        url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      })
    )
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
    viewer.current = new Viewer("cesium-container",{
      selectionIndicator: false,
      baseLayer: false,
      baseLayerPicker:false,
      sceneModePicker:false,
      navigationHelpButton:false,
      homeButton:true,
      skyBox:false,
      infoBox:false,
      timeline:true,
      animation:true,
      vrButton:false,
      geocoder:false,
      fullscreenButton:false,
      navigationInstructionsInitiallyVisible:false,
      shouldAnimate:true,
      creditContainer: document.createElement("div"),
    })
    // 添加地形
    const terrainProvider = await CesiumTerrainProvider.fromIonAssetId(1)
    viewer.current.terrainProvider = terrainProvider
    // 设置相机位置
    viewer.current.camera.setView({
      destination: Cartesian3.fromDegrees(120, 28, 50000),
      orientation: {
        heading: CMath.toRadians(0),
        pitch: CMath.toRadians(-45),
        roll: CMath.toRadians(0),
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
      viewer.current?.destroy()
    }
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
