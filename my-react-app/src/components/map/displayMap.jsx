import * as React from "react";

const DisplayMap = (props) => {
  const apikey = props.apikey;
  const gps = props.gps;
  const mapRef = React.useRef(null);
  const mapInstanceRef = React.useRef(null);

  React.useLayoutEffect(() => {
    if (!mapRef.current) {
      console.error("mapRef.current is not initialized");
      return;
    }

    const H = window.H;
    const platform = new H.service.Platform({ apikey: apikey });
    const defaultLayers = platform.createDefaultLayers();

    var omvService = platform.getOMVService({ path: "v2/vectortiles/core/mc" });
    var baseUrl = "https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/";

    var style = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);
    var omvProvider = new H.service.omv.Provider(omvService, style);
    var omvlayer = new H.map.layer.TileLayer(omvProvider, {
      max: 22,
      dark: true,
    });

    var map = new H.Map(mapRef.current, omvlayer, {
      zoom: 16,
      center: { lat: gps.lat, lng: gps.lng },
    });

    const handleResize = () => map.getViewPort().resize();
    window.addEventListener("resize", handleResize);

    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener("resize", handleResize);
      map.dispose();
    };
  }, [apikey]);

  React.useEffect(() => {
    if (!mapInstanceRef.current) return;

    const H = window.H;
    const map = mapInstanceRef.current;

    map.removeObjects(map.getObjects());

    const marker = new H.map.Marker({ lat: gps.lat, lng: gps.lng });
    map.addObject(marker);

    map.setCenter({ lat: gps.lat, lng: gps.lng });
  }, [gps]);

  return (
    <div className="map-container">
      <input type="text" placeholder="Search Location" className="map-input" />
      <div className="map-ref" ref={mapRef} />
    </div>
  );
};

export default DisplayMap;
