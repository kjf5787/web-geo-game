import L, { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import { MapContainer } from "react-leaflet";
import { useConnection } from "../../Contexts/ConnectionContext";
import LayerControl from "./LayerControl";
import MapInitializer from "./MapInitializer";
import MapMask from "./MapMask";
import MarkersLayer from "./MarkersLayer";
import MapSearch from "./MapSearch";

interface GameMapProps {
   polygon: L.Polygon | null;
   showPopup?: boolean;
   selectable?: boolean;
}

export default function GameMap({ polygon, showPopup = true, selectable = false }: GameMapProps) {
   const { socket } = useConnection();

   useEffect(() => {
      socket.emit("request-map-markers");
   }, [socket]);

   if (!polygon) {
      console.error("Error: Polygon is null in GameMap component.");
      return null;
   }

   const bounds = polygon.getBounds();
   const polygonCoords = polygon.getLatLngs()[0] as LatLngExpression[];

   return (
      <MapContainer
         center={bounds.getCenter()}
         scrollWheelZoom={true}
         zoom={13}
         style={{ height: "100%", width: "100%" }}
         maxBounds={bounds}
         maxBoundsViscosity={0.8}
      >
         <MapSearch bounds={polygon.getBounds()}/>
         <MapInitializer bounds={bounds} />
         <LayerControl />
         <MarkersLayer showPopup={showPopup} selectable={selectable} />
         <MapMask polygonCoords={polygonCoords} />
      </MapContainer>
   );
}
