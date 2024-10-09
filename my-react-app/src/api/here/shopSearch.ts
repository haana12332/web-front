import { Gps } from "@/type/type";
import { SearchResult } from "@/type/type";

declare global {
  interface Window {
    H: any;
  }
}

export function shopsearch(
  apikey: string,
  searchtext: string,
  gps: Gps
): Promise<SearchResult[]> {
  return new Promise((resolve, reject) => {
    const H = window.H;
    const platform = new H.service.Platform({
      apikey: apikey,
    });

    const service = platform.getSearchService();

    // `discover`メソッドを使用して周辺の場所を1km圏内で検索
    service.discover(
      {
        q: searchtext,
        at: `${gps.lat},${gps.lng}`, // 検索の中心位置
        limit: 3,
      },
      (result: any) => {
        if (result.items) {
          const filteredResults: SearchResult[] = result.items.map(
            (item: any) => ({
              title: item.title,
              position: item.position,
              distance: item.distance,
            })
          );
          resolve(filteredResults); // 結果を解決する
        } else {
          resolve([]); // 結果がない場合、空の配列を返す
        }
      },
      (error: any) => {
        reject(error); // エラーが発生した場合に拒否
      }
    );
  });
}
