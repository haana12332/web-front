import * as React from "react";
import { Gps } from "@/type/type";
import { shopsearch } from "@/api/here/shopSearch";
import { routeSearch } from "@/api/here/routeSearch"; // ルート検索関数をインポート
import { SearchResult } from "@/type/type";

interface DisplayMapProps {
  apikey: string;
  origin: Gps;
}

declare global {
  interface Window {
    H: any;
  }
}

export function DisplayMap({ apikey, origin }: DisplayMapProps) {
  const mapRef = React.useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = React.useRef<any>(null);
  const [shopResult, setShopResult] = React.useState<SearchResult[]>([]);
  const [searchText, setSearchText] = React.useState(""); // 検索ボックスの入力状態を管理
  const [routeLine, setRouteLine] = React.useState<any>(null); // ルートラインの状態を管理
  const [destination, setDestination] = React.useState<Gps | null>(null);

  // 近くの店を探す
  const handleChangeShops = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchText = e.target.value;
    setSearchText(searchText); // 入力状態を更新

    if (searchText.trim() === "") {
      setShopResult([]); // 検索結果をクリアする
      return;
    }

    const fetchShops = async () => {
      try {
        const result: SearchResult[] = await shopsearch(apikey, searchText, origin);
        setShopResult(result); // 結果をステートに保存
      } catch (error) {
        console.error("Error fetching shop results:", error);
      }
    };

    fetchShops(); // 非同期関数を呼び出す
  };

  // 店までのルートを検索し、マップ上に表示
  const handleSearchRoute = async (index: number) => {
    const targetShop = shopResult[index];
    setDestination(targetShop.position); // 目的地を設定
  };

  // 初期化: マップの描画を行う
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
      center: { lat: origin.lat, lng: origin.lng },
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
  }, [apikey, origin.lat, origin.lng]);

  // ルートラインとショップの表示を管理するuseEffect
  React.useEffect(() => {
    if (!mapInstanceRef.current) return;

    const H = window.H;
    const map = mapInstanceRef.current;

    // マップ上のオブジェクトをクリア
    map.removeObjects(map.getObjects());

    // 検索結果のマーカーを表示
    shopResult.forEach((result) => {
      const position = result.position;
      const iconUrl = "/explore_nearby_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.svg"; // ローカルのアイコン画像パス
      const icon = new H.map.Icon(iconUrl); // アイコンを指定
      const searchMarker = new H.map.Marker(
        { lat: position.lat, lng: position.lng },
        { icon }
      );
      map.addObject(searchMarker); // マーカーをマップに追加
    });

    // 現在位置のマーカーを追加
    const marker = new H.map.Marker({ lat: origin.lat, lng: origin.lng });
    map.addObject(marker);

    // ルート検索を行う
    const searchRoute = async () => {
      if (origin && destination) {
        try {
          const route = await routeSearch(apikey, origin, destination); // `routeSearch`関数を使う
          console.log("Routing result:", route); // レスポンス全体を確認

          // ルートが存在し、ポリラインが定義されているか確認
          if (route && route.polyline) {
            const linestring = H.geo.LineString.fromFlexiblePolyline(route.polyline);
            const newRouteLine = new H.map.Polyline(linestring, {
              style: { strokeColor: "blue", lineWidth: 3 },
            });
            map.addObjects([newRouteLine]);
            map.getViewModel().setLookAtData({ bounds: newRouteLine.getBoundingBox() });
            setRouteLine(newRouteLine); // 新しいルートラインを設定
          } else {
            console.error("Route polyline is missing");
          }
        } catch (error) {
          console.error("Error searching route:", error);
        }
      }
    };

    searchRoute(); // ルート検索を実行

    // マップの中心を更新
    map.setCenter({ lat: origin.lat, lng: origin.lng });
  }, [apikey, origin, shopResult, destination]);

  return (
    <div className="map-container">
      <input
        type="text"
        className="map-input"
        onChange={handleChangeShops}
        placeholder="Search location ..."
      />
      {searchText.trim() !== "" && shopResult.length > 0 && (
        <div className="shop-results">
          {shopResult.map((result, index) => (
            <div onClick={() => handleSearchRoute(index)} key={index} className="shop-result-item">
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
