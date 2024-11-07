function addSingleImgLayer () {
  viewer.imageryLayers.addImageryProvider(
    new Cesium.SingleTileImageryProvider({
        url: "img/worldimage.jpg"
    })
  )
}