import * as React from "react";
import { Gps } from "@/type/type";
import { shopsearch } from "@/api/here/shopSearch";
import { SearchResult } from "@/type/type";

interface DisplayMapProps {
  apikey: string;
  gps: Gps;
}

declare global {
  interface Window {
    H: any;
  }
}

export function DisplayMap({ apikey, gps }: DisplayMapProps) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const [shopResult, setShopResult] = React.useState<SearchResult[]>([]);
  const [searchText, setSearchText] = React.useState(""); // 検索ボックスの入力状態を管理

  function handleChangeShops(e: React.ChangeEvent<HTMLInputElement>) {
    const searchtext = e.target.value;
    setSearchText(searchtext); // 入力状態を更新

    // テキストボックスが空の場合は検索結果をクリア
    if (searchtext.trim() === "") {
      setShopResult([]); // 検索結果をクリアする
      return;
    }

    // 非同期処理を行う
    async function fetchShops() {
      try {
        const result: SearchResult[] = await shopsearch(
          apikey,
          searchtext,
          gps
        );
        setShopResult(result); // 結果をステートに保存
      } catch (error) {
        console.error("Error fetching shop results:", error);
      }
    }

    fetchShops(); // 非同期関数を呼び出す
  }

  React.useLayoutEffect(() => {
    if (!mapRef.current) {
      console.error("mapRef.current is not initialized");
      return;
    }

    const H = window.H;
    const platform = new H.service.Platform({ apikey });
    const defaultLayers = platform.createDefaultLayers();

    const omvService = platform.getOMVService({
      path: "v2/vectortiles/core/mc",
    });
    const baseUrl = "https://js.api.here.com/v3/3.1/styles/omv/oslo/japan/";

    const style = new H.map.Style(`${baseUrl}normal.day.yaml`, baseUrl);
    const omvProvider = new H.service.omv.Provider(omvService, style);
    const omvLayer = new H.map.layer.TileLayer(omvProvider, {
      max: 22,
      dark: true,
    });

    const map = new H.Map(mapRef.current, omvLayer, {
      zoom: 16,
      center: { lat: gps.lat, lng: gps.lng },
    });

    const handleResize = () => map.getViewPort().resize();
    window.addEventListener("resize", handleResize);

    new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    H.ui.UI.createDefault(map, defaultLayers);

    mapInstanceRef.current = map;

    return () => {
      window.removeEventListener("resize", handleResize);
      map.dispose();
    };
  }, [apikey, gps.lat, gps.lng]);

  React.useEffect(() => {
    if (!mapInstanceRef.current) return;

    const H = window.H;
    const map = mapInstanceRef.current;

    // マップ上のオブジェクトをクリア
    map.removeObjects(map.getObjects());

    // 新しいマーカーを追加
    const marker = new H.map.Marker({ lat: gps.lat, lng: gps.lng });
    map.addObject(marker);

    // マップの中心を更新
    map.setCenter({ lat: gps.lat, lng: gps.lng });
  }, [gps]);

  return (
    <div className="map-container">
      <input
        type="text"
        className="map-input"
        onChange={handleChangeShops}
        placeholder="Search location"
      />

      {/* 検索結果が存在し、検索ボックスが空でない場合のみ表示 */}
      {searchText.trim() !== "" && shopResult.length > 0 && (
        <div className="shop-results">
          {shopResult.map((result, index) => (
            <div key={index} className="shop-result-item">
              <h3>{result.title}</h3>
              <p>
                Position: {result.position.lat}, {result.position.lng}
              </p>
              <p>Distance: {result.distance} meters</p>
            </div>
          ))}
        </div>
      )}

      <div className="map-ref" ref={mapRef} />
    </div>
  );
}

export default DisplayMap;
