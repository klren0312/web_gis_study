function setBasePrimitive(viewer) {
  const primitive = new Cesium.Primitive(
    {
      geometryInstances: new Cesium.GeometryInstance(
        {geometry: new Cesium.EllipseGeometry(
            {center: Cesium.Cartesian3.fromDegrees(-100.0, 20.0),
            semiMinorAxis: 500000.0,
            semiMajorAxis: 1000000.0,
            rotation: Cesium.Math.PI_OVER_FOUR,
            vertexFormat: Cesium.VertexFormat.POSITION_AND_ST}
        ),}
    ),
    appearance: new Cesium.EllipsoidSurfaceAppearance(
        {material: Cesium.Material.fromType('Stripe')}
    )}
  );
  viewer.scene.primitives.add(primitive);
}

function setAddPrimitive(viewer) {
  const rectangleInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.RectangleGeometry({
        rectangle: Cesium.Rectangle.fromDegrees(-140.0, 30.0, -100.0, 40.0),
        vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT
    }),
    id:'rectangle',
    attributes: {
        color: new Cesium.ColorGeometryInstanceAttribute(0.0, 1.0, 1.0, 0.5)
    }
});

const ellipsoidInstance = new Cesium.GeometryInstance({
    geometry: new Cesium.EllipsoidGeometry({
        radii: new Cesium.Cartesian3(500000.0,500000.0,1000000.0),
        vertexFormat: Cesium.VertexFormat.POSITION_AND_NORMAL
    }),
    modelMatrix: Cesium.Matrix4.multiplyByTranslation(Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(-95.59777,40.03883)
    ),new Cesium.Cartesian3(0.0, 0.0, 500000.0), new Cesium.Matrix4()),
    id:'ellipsoid',
    attributes: {
        color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.AQUA)
    }
});

viewer.scene.primitives.add(new Cesium.Primitive({
    geometryInstances:[rectangleInstance, ellipsoidInstance],
    appearance: new Cesium.PerInstanceColorAppearance()
}));
}