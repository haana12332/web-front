import { useContext } from "react";
import { GpsContext } from "./context/gpsdata";
import { useState, useEffect } from "react";

export function SlidingPanel(): JSX.Element {
  const [logs, setLogs] = useState<string[]>([]);
  const [serverData, setServerData] = useState<string | null>(null);
  const [inputData, setInputData] = useState<string>("Test Data from Client"); // テキストボックス用のステート
  const API_ENDPOINT = "http://172.20.10.2:8080";

  const gpsContext = useContext(GpsContext);
  if (gpsContext) {
    console.log("sliding", gpsContext.gpsDate);
  }

  useEffect(() => {
    checkServerStatus();
  }, []);

  async function handleSendData() {
    setLogs((prevLogs) => [...prevLogs, "Sending data to server..."]);

    try {
      // gpsDateを取得（nullの場合を考慮）
      const gpsData = gpsContext?.gpsDate
        ? {
            lat: gpsContext.gpsDate.lat.toString(),
            lng: gpsContext.gpsDate.lng.toString(),
          }
        : { lat: "", lng: "" };

      const response = await fetch(`${API_ENDPOINT}/postData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          data: inputData, // テキストボックスのデータを使用
          latitude: gpsData.lat, // gpsDateの緯度
          longitude: gpsData.lng, // gpsDateの経度
        }),
      });

      const result = await response.text();
      setLogs((prevLogs) => [...prevLogs, `Server response: ${result}`]);
    } catch (error) {
      console.error("Error:", error);
      setLogs((prevLogs) => [
        ...prevLogs,
        "Error: Could not communicate with the server",
      ]);
    }
  }

  async function checkServerStatus() {
    setLogs((prevLogs) => [...prevLogs, "Checking server status..."]);

    try {
      const response = await fetch(`${API_ENDPOINT}`, {
        method: "GET",
      });

      const result = await response.text();
      setServerData(result);
      setLogs((prevLogs) => [...prevLogs, `Server data: ${result}`]);
    } catch (error) {
      console.error("Error:", error);
      setLogs((prevLogs) => [
        ...prevLogs,
        "Error: Could not retrieve server status",
      ]);
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", margin: 0 }}>
      {/* サイドバー */}
      <div
        style={{ flex: "0 0 150px", padding: "10px", background: "#f0f0f0" }}
      >
        <h3>Sliding Panel</h3>

        {/* テキストボックスを追加 */}
        <input
          type="text"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          style={{ width: "100%", marginBottom: "10px" }}
        />

        <button style={{ margin: "10px 0" }} onClick={handleSendData}>
          Send Data to Server
        </button>
        <button style={{ margin: "10px 0" }} onClick={checkServerStatus}>
          Check Server Status
        </button>

        {/* サーバーからのデータを表示 */}
        <div>
          <h4>Server Data:</h4>
          <p>{serverData ? serverData : "No data from server yet."}</p>
        </div>

        {/* ログメッセージを表示 */}
        <div>
          <h4>Logs:</h4>
          {logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
