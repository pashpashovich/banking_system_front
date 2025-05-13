import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const BelarusLoanMap = () => {
  const [cityData, setCityData] = useState([]);
  const [loanStats, setLoanStats] = useState({});

  useEffect(() => {
    fetch("/data/by-cities.json")
      .then((res) => res.json())
      .then(setCityData)
      .catch((err) => console.error("Ошибка загрузки городов:", err));

    axios
      .get("http://localhost:8080/api/loan-management/regions", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
      .then((res) => setLoanStats(res.data))
      .catch((err) => console.error("Ошибка загрузки статистики:", err));
  }, []);

  return (
    <MapContainer
      center={[53.9, 27.5667]}
      zoom={7}
      style={{ height: "600px", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {cityData.map((city, index) => {
        const stats = loanStats[city.city]; 
        if (!stats || stats.requestCount === 0) return null;

        return (
          <CircleMarker
            key={index}
            center={[parseFloat(city.lat), parseFloat(city.lng)]}
            radius={5 + stats.requestCount}
            pathOptions={{
              color: "#24695C",
              fillColor: "#56b890",
              fillOpacity: 0.6,
            }}
          >
            <Tooltip direction="top" offset={[0, -8]} opacity={1}>
              <div>
                <div>
                  <strong>{city.city}</strong>
                </div>
                <div>Заявок: {stats.requestCount}</div>
                <div>Одобрено: {stats.approvedCount}</div>
                <div>Сумма: {stats.totalAmount.toLocaleString()} BYN</div>
              </div>
            </Tooltip>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
};

export default BelarusLoanMap;
