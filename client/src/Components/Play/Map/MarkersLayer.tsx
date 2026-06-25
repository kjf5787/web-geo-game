import L from "leaflet";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { RoundStage } from "../../../data/DataTypes";
import { useGameMarkers } from "../../Contexts/GameMarkersContext";
import { useGameRoom } from "../../Contexts/GameRoomContext";
import MapMarker from "./MapMarker";
import { useLocalGameData } from "../../Contexts/LocalGameContext";

// Function to blend between two colors
const blendColors = (count: number) => {
   // Define start and end colors (for blending between two colors)
   const startColor = { r: 255, g: 255, b: 255 };
   const endColor = { r: 170, g: 118, b: 78 };

   const max = 14;

   // Ensure count is between 1 and 12
   const normalizedCount = Math.min(max, Math.max(1, count));

   // Blend the colors based on the marker count
   const ratio = (normalizedCount - 1) / (max - 1); // Normalize between 0 and 1

   const r = Math.round(startColor.r + ratio * (endColor.r - startColor.r));
   const g = Math.round(startColor.g + ratio * (endColor.g - startColor.g));
   const b = Math.round(startColor.b + ratio * (endColor.b - startColor.b));

   return `rgb(${r}, ${g}, ${b})`;
};

export default function MarkersLayer({ showPopup = true, selectable = false }: { showPopup?: boolean, selectable?: boolean }) {
   const { markers } = useGameMarkers();
   const { gameRoomState } = useGameRoom();
   const map = useMap();
   const { selectedPlayerID } = useLocalGameData();
   const visibleMarkers = selectedPlayerID
      ? markers.filter(m => m.ownerPlayerID === selectedPlayerID)
      : markers;

   useEffect(() => {
      if (map) {
         const currentCenter = map.getCenter();
         const currentZoom = map.getZoom();
         // Restore center and zoom after marker update
         map.setView(currentCenter, currentZoom);
      }
   }, [markers, map]);

   // Create a custom cluster icon with a transparent circle and shadow
   // eslint-disable-next-line @typescript-eslint/no-explicit-any
   const createClusterIcon = (cluster: any) => {
      const count = cluster.getChildCount();
      const size = Math.max(40, 16 + count * 2);  // Set size dynamically
      const color = blendColors(count);  // Use blended color based on count

      return L.divIcon({
         html: `<div style="background: ${color}; width: ${size}px; height: ${size}px; border: 4px solid black; border-radius: 50%; text-align: center; line-height: ${size}px; color: black; font-size: 14px; font-weight: bold; opacity: 0.75; display: inline-block; margin: 0; padding: 0; overflow: hidden; vertical-align: middle;">
                  ${count}
               </div>`,
         className: "leaflet-div-icon",  // Use default className for Leaflet
         iconSize: L.point(size, size),  // Set size dynamically
      });
   };

   return (
      <MarkerClusterGroup
         showCoverageOnHover={true}
         iconCreateFunction={createClusterIcon}
         key={markers.length}  // Force re-render on markers change
      >
         {visibleMarkers.map((marker) => (
            <MapMarker
               key={marker.id}
               marker={marker}
               voting={gameRoomState?.round.stage === RoundStage.Voting}
               showPopup={showPopup}
               selectable={selectable}
            />
         ))}
      </MarkerClusterGroup>
   );
}
