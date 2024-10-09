import { useState } from "react";

// propsの型定義
interface SearchProps {
  apikey: string;
  onGeocodeResult: (position: { lat: number; lng: number }) => void;
}

export function Search(props: SearchProps) {
  const [text, setText] = useState<string>("");

  // APIキーとHERE Mapsオブジェクト
  const apikey = props.apikey;
  const H = window.H;

  const platform = new H.service.Platform({
    apikey: apikey,
  });

  const service = platform.getSearchService();

  // 検索クリック時の処理
  const onClickSearch = () => {
    service.geocode(
      {
        q: text,
        limit: 10,
      },
      (result: any) => {
        result.items.forEach((item: any) => {
          console.log(item.position);
          props.onGeocodeResult(item.position);
        });
      },
      alert
    );
    setText("");
  };

  return (
    <div>
      <input
        type="text"
        name="query"
        id="query"
        value={text}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          setText(event.target.value)
        }
        placeholder="Search location"
        className="map-input"
      />
    </div>
  );
}

export default Search;
