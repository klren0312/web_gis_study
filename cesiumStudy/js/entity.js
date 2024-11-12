function drawEntity (viewer) {
  let position1 = new Cesium.Cartesian3.fromDegrees(120, 25, 10000)
  let color1 = new Cesium.Color(1, 1, 0, 1)
  const point1 = viewer.entities.add({
    name: '点1',
    position: position1,
    point: {
      show: true,
      pixelSize: 20,
      color: color1
    }
  })

  let position2 = new Cesium.Cartesian3.fromDegrees(120, 30, 100000)
  let color2 = new Cesium.Color(1, 0, 0, 1)
  const point2 = viewer.entities.add({
    name: '点2',
    position: new Cesium.CallbackProperty(() => {
      return position2
    }, false),
    point: {
      show: true,
      pixelSize: 20,
      color: new Cesium.CallbackProperty(function () {
        return color2
      }, false)
    }
  })

  let outline = true;
  let polygon2 = viewer.entities.add({
      name: "polygon2",
      polygon: {
        show: true,
        hierarchy: Cesium.Cartesian3.fromDegreesArray([
          120.0,
          35.0,
          124.0,
          35.0,
          122.0,
          37.0,
        ]),
        height: 50000,
        extrudedHeight: 100000,
        fill: true,
        material: Cesium.Color.YELLOW,

        outline: new Cesium.CallbackProperty(()=>{
          return outline;
        }, false),
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 5.0,
      }
  })

  let i = 0;
  let j = 1;

  // 每隔100毫秒修改一次参数
  setInterval(()=>{
    // 方法1：直接给entity的参数赋新值
    point1.position = new Cesium.Cartesian3.fromDegrees(120-1*i, 25, 100000);
    point1.point.color = new Cesium.Color(1, 1, 0, 0.1*i);
    // polygon1.polygon.outline = i%2 == 0? true:false;

    // 方法2: 修改参数对应的回调函数中的变量
    position2 = new Cesium.Cartesian3.fromDegrees(120-1*i, 30, 10000);
    color2 = new Cesium.Color(1, 0, 0, 0.1*i);
    outline = !outline;

    // 使变量间隔2秒重复
    if(i>=10){
        j = -1;
    }
    if(i<=0){
        j = 1;
    }

    i += j;
  }, 100)


  var blueBox = viewer.entities.add({
    name : 'Blue box',
    position: Cesium.Cartesian3.fromDegrees(-114.0, 40.0, 300000.0),
    box : {
        dimensions : new Cesium.Cartesian3(400000.0, 300000.0, 500000.0),
        material : Cesium.Color.BLUE,
        outline: true,
    }
  });
  var property = new Cesium.SampledProperty(Cesium.Cartesian3);

  property.addSample(Cesium.JulianDate.fromIso8601('2024-11-12T00:00:00.00Z'), 
      new Cesium.Cartesian3(400000.0, 300000.0, 200000.0));

  property.addSample(Cesium.JulianDate.fromIso8601('2024-11-13T00:00:00.00Z'), 
      new Cesium.Cartesian3(400000.0, 300000.0, 700000.0));

  blueBox.box.dimensions = property;

}