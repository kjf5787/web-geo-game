import { Box, Button, Text } from "@chakra-ui/react";
import markerIconPng from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import { Marker, Popup } from "react-leaflet";
import { MapMarkerData } from "../../../data/DataTypes";
import { getSolution } from "../../../data/data";
import { useConnection } from "../../Contexts/ConnectionContext";
import { useGameRoom } from "../../Contexts/GameRoomContext";
import { useLocalGameData } from "../../Contexts/LocalGameContext";
import { getIconColor } from "../../Lobby/Icon";
import { getSolutionImagePath } from '../Game/SolutionInfoCard';
import { coordsToString } from "../Voting/MarkerInfoCard";
import { useTranslation } from "react-i18next";

const defaultIcon = L.icon({
   iconSize: [25, 41],
   iconAnchor: [10, 41],
   popupAnchor: [2, -40],
   iconUrl: markerIconPng,
   shadowUrl: iconShadow
});

interface MapMarkerProps {
   marker: MapMarkerData;
   voting: boolean;
   showPopup?: boolean;
   selectable?: boolean;
}

export default function MapMarker({ marker, voting, showPopup = true, selectable = false }: MapMarkerProps) {
   const { gameRoomState, getPlayerData } = useGameRoom();
   const { setSelectedMarkerID, selectedMarkerID } = useLocalGameData();
   const { localPlayerID } = useConnection();
   const { t } = useTranslation();

   if (gameRoomState === null) {
      console.error("No game room state");
   }

   const solution = getSolution(marker.solutionID);
   const imagePath = getSolutionImagePath(solution?.image);

   const ownerColor = getPlayerData(marker.ownerPlayerID)?.color;
   const color = getIconColor(ownerColor, 0.5);
   const isSelected = selectedMarkerID === marker.id;

   let style = document.querySelector(`#style-marker-${marker.id}`);
   if (!style) {
      style = document.createElement('style');
      style.id = `style-marker-${marker.id}`;
      document.head.appendChild(style);
   }

   style.innerHTML = `
      .marker-color-backing-${marker.id} {
         ${isSelected ? 'animation: marker-pulse 1.2s ease-in-out infinite;' : ''}
      }
      @keyframes marker-pulse {
         0%, 100% { opacity: 1; }
         50% { opacity: 0.2; }
      }
   `;

   const markerIcon = L.divIcon({
      className: '',
      html: `
         <div style="position: relative; width: 40px; height: 40px;">
            <div class="marker-color-backing-${marker.id}" style="
               position: absolute; inset: 0;
               border-radius: 50%;
               background: ${color};
               box-shadow: 0 0 5px 3px ${color};
            "></div>
            <img src="${imagePath || markerIconPng}" style="
               position: absolute; inset: 0;
               width: 40px; height: 40px;
               object-fit: contain;
            "/>
         </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, solution?.roundIcon ? 20 : 40],
      popupAnchor: [0, solution?.roundIcon ? -16 : -36],
   });

   const player = getPlayerData(marker.ownerPlayerID);

   return (
      <Marker
         icon={markerIcon}
         title={solution?.name}
         key={marker.id}
         position={{ lat: marker.coordinates.lat, lng: marker.coordinates.lng }}
         eventHandlers={{
            click: (e) => {
               L.DomEvent.stopPropagation(e);
               if (voting || selectable) {
                  setSelectedMarkerID(selectedMarkerID === marker.id ? null : marker.id);
               }
            },
         }}
      >
         {!voting && showPopup && (
            <Popup>
               <Box>
                  <Text fontSize="14px" as="b">{solution?.name}</Text>
                  <Text fontSize="12.5px">
                     {t('solution-info.location')}: {coordsToString(marker.coordinates)} <br />
                     {t('solution-info.price')}: €{solution?.price} <br />
                     {t('solution-info.placed-by')}: {player?.role} <br />
                     {t('solution-info.round-placed')}: {marker.roundIndex + 1} <br />
                     {t('solution-info.vote-count')}: {marker.votes?.length || 0} <br />
                  </Text>
                  <Box display="flex" flexDirection="row" alignItems="flex-end"
                     justifyContent="center" gap={2} mt={3}>
                     <Button colorScheme="gray" size="sm"
                        onClick={() => setSelectedMarkerID(marker.id)}
                     >
                        {t('solution-info.show-more')}
                     </Button>
                  </Box>
               </Box>
            </Popup>
         )}
      </Marker>
   );
}