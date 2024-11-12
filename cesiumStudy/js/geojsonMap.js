function addChinaGeoJsonMap (viewer) {
  // geojson矢量加载
  viewer.dataSources.add(
    Cesium.GeoJsonDataSource.load(
      "https://geojson.cn/api/china/china.topo.json",
      {
        stroke: Cesium.Color.HOTPINK,
        fill: Cesium.Color.PINK.withAlpha(0.5),
        strokeWidth: 3,
      }
    )
  )
}