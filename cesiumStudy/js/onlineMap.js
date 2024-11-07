// 加载高德瓦片
// UrlTemplateImageryProvider 是 Cesium 中用于加载基于 URL 模板的图像图层的类。它允许你通过指定一个包含占位符的 URL 模板来加载地图切片或其他类型的图像
// URL 模板可以包含 {x}、{y} 和 {z} 等占位符，分别代表切片的 x 坐标、y 坐标和缩放级别。
// 它不特定于任何地图服务协议，因此可以用来加载各种来源的图像，包括自定义地图、卫星图像等
function addGaodeLayer (viewer) {
  // 底图
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
      layer: 'tdtVecBasicLayer',
      style: 'default',
      format: 'image/png',
      tileMatrixSetID: 'GoogleMapsCompatible',
      show: false,
    })
  )
  // 标注
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url: 'http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8',
      layer: 'tdtAnnoLayer',
      style: 'dark',
      format: 'image/png',
      tileMatrixSetID: 'GoogleMapsCompatible',
    })
  )
}

// 加载腾讯地图
function addTencentLayer (viewer) {
  viewer.imageryLayers.addImageryProvider(new Cesium.UrlTemplateImageryProvider({
    url : 'https://p2.map.gtimg.com/sateTiles/{z}/{sx}/{sy}/{x}_{reverseY}.jpg?version=229',
    customTags : {
      sx: function(imageryProvider, x, y, level) {
        return x>>4
      },
      sy:function(imageryProvider, x, y, level) {
        return ((1<<level)-y)>>4
      }
    }
  }))
}

// 加载矢量天地图
// WebMapTileServiceImageryProvider 是 Cesium 中用于加载 Web 地图切片服务的类。它可以从指定的 URL 加载地图切片，并将其作为图像图层添加到 Cesium 视图中。
// Web 地图切片服务（WMTS）规范的地图
function addTiandituLayer (viewer) {
  const key = '3469310af30cafdcc1178a58617ffebd'
  // ================ 矢量 ====================
  // //加载底图
  // const imagery = viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
  //   url: "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + key,
  //   layer: "tdtVecBasicLayer",
  //   style: "default",
  //   format: "image/jpeg",
  //   tileMatrixSetID: "GoogleMapsCompatible"
  // }))
  // imagery.hue = 3
  // imagery.contrast = -1.2
  // //加载注记
  // viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
  //   url: "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + key,
  //   layer: "tdtAnnoLayer",
  //   style: "default",
  //   format: "image/jpeg",
  //   tileMatrixSetID: "GoogleMapsCompatible"
  // }))

  // ================= 影像 ====================
  //加载底图
  viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=" + key,
    layer: "tdtBasicLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible"
  }))

  //加载注记
  viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
    url: "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=" + key,
    layer: "tdtAnnoLayer",
    style: "default",
    format: "image/jpeg",
    tileMatrixSetID: "GoogleMapsCompatible"
  }))

}


// 加载openstreetmap地图
function addOpenStreetMapImagery(viewer) {
  // viewer.imageryLayers.addImageryProvider(
  //   new Cesium.UrlTemplateImageryProvider({
  //       url: 'https://tile-{s}.openstreetmap.fr/hot/{z}/{x}/{y}.png',
  //       subdomains: ["a", "b", "c", "d"],
  //   })
  // )
  // 暗黑风格
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
        url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        subdomains: ["a", "b", "c", "d"],
    })
  )
}

// 加载默认NaturalEarthII地图
function addNaturalEarthIIImagery(viewer) {
  viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
      url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII') + '/{z}/{x}/{reverseY}.jpg',
      tilingScheme : new Cesium.GeographicTilingScheme(),
      maximumLevel : 5
    })
  )
}