import React, { useEffect, useRef, useState } from "react";

const Supervision = () => {
  const mapContainerRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    const luandaCoords = { lat: -8.8368, lng: 13.2343 }; // Coordinates for Mutamba, Luanda
    const googleMap = new window.google.maps.Map(mapContainerRef.current, {
      center: luandaCoords,
      zoom: 14,
    });
    setMap(googleMap);

    // Adicionando marcadores para a Mutamba
    const mutambaMarkers = [
      {
        id: 1,
        coords: { lat: -8.8368, lng: 13.2343 },
        title: "Mutamba 1",
        description: "Localidade em Luanda",
      },
      {
        id: 1,
        coords: { lat: -8.835, lng: 13.235 },
        title: "Mutamba 2",
        description: "Localidade em Luanda",
      },
      {
        id: 1,
        coords: { lat: -8.837, lng: 13.2355 },
        title: "Mutamba 3",
        description: "Localidade em Luanda",
      },
      {
        id: 1,
        coords: { lat: -8.838, lng: 13.2358 },
        title: "Mutamba 4",
        description: "Localidade em Luanda",
      },
      {
        id: 2,
        coords: { lat: -8.834, lng: 13.236 },
        title: "Mutamba 5",
        description: "Localidade em Luanda",
      },
      {
        id: 2,
        coords: { lat: -8.836, lng: 13.237 },
        title: "Mutamba 6",
        description: "Localidade em Luanda",
      },
      {
        id: 2,
        coords: { lat: -8.839, lng: 13.238 },
        title: "Mutamba 7",
        description: "Localidade em Luanda",
      },
    ];

    const newMarkers = mutambaMarkers.map((marker) =>
      addMarker(
        marker.coords,
        googleMap,
        marker.title,
        marker.description,
        marker.id
      )
    );
    setMarkers(newMarkers);
  }, []);

  function addMarker(location, map, title, description, id) {
    const marker = new window.google.maps.Marker({
      position: location,
      map: map,
      title: title,
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `<div><h3>${title}</h3><p>${description}</p></div>`,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
      setSelectedUser(id);
    });

    return { marker, id };
  }

  useEffect(() => {
    if (selectedUser !== null) {
      showRoute(selectedUser);
    }
  }, [selectedUser]);

  function showRoute(userId) {
    // Remover a polyline existente, se houver
    if (polyline) {
      polyline.setMap(null);
    }

    // Encontrar os marcadores selecionados com base no ID do usuário
    const userMarkers = markers.filter((marker) => marker.id === userId);

    // Criando um array de pontos para a polyline
    const path = userMarkers.map((marker) => marker.marker.getPosition());

    // Criando uma polyline para conectar os marcadores
    const line = new window.google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    // Exibindo a linha no mapa
    line.setMap(map);

    setPolyline(line);
  }

  return (
    <div>
      <div
        ref={mapContainerRef}
        style={{ marginLeft: "30px", height: "92vh", width: "100%" }}
      ></div>
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setSelectedUser(1)}>
          Mostrar rota para Usuário 1
        </button>
        <button onClick={() => setSelectedUser(2)}>
          Mostrar rota para Usuário 2
        </button>
      </div>
    </div>
  );
};

export default Supervision;
