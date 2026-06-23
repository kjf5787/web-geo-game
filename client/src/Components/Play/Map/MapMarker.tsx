import { Box, Button, Text } from "@chakra-ui/react";
import icon from 'leaflet/dist/images/marker-icon.png';
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
   iconUrl: icon,
   shadowUrl: iconShadow
});

// L.Marker.prototype.options.icon = defaultIcon;

interface MapMarkerProps {
   marker: MapMarkerData;
   voting: boolean;
}

const localIconClassName = 'local-marker-icon';

export default function MapMarker({ marker, voting }: MapMarkerProps) {
   const { gameRoomState, getPlayerData } = useGameRoom();
   const { setSelectedMarkerID } = useLocalGameData();
   const { localPlayerID } = useConnection();
   const { t } = useTranslation();

   if (gameRoomState === null) {
      console.error("No game room state");
   }

   const solution = getSolution(marker.solutionID);

   const imagePath = getSolutionImagePath(solution?.image);

   const icon = !imagePath ? defaultIcon : L.icon({
      iconUrl: imagePath,
      iconSize: [40, 40],
      iconAnchor: [20, solution?.roundIcon ? 20 : 40], // center or bottom border
      popupAnchor: [0, solution?.roundIcon ? -16 : -36], // top border
   });

   // if (marker.ownerPlayerID === localPlayerID) {
   //    const localPlayerColor = getPlayerData(localPlayerID)?.color;

   //    // Check if a style element for the local icon already exists
   //    let style = document.querySelector(`#style-${localIconClassName}`);
   //    if (!style) {
   //       // Create the style element if it doesn't exist
   //       style = document.createElement('style');
   //       style.id = `style-${localIconClassName}`;
   //       document.head.appendChild(style);
   //    }

   //    const color = getIconColor(localPlayerColor, 0.5);
   //    // Update the style content dynamically
   //    style.innerHTML = `
   //       .${localIconClassName} {
   //          background: ${color};
   //          border-radius: 50%;
   //          box-shadow: 0 0 5px 3px ${color};
   //       }
   //    `;

   //    // if it is the player's marker, add a border to the icon
   //    icon.options.className = localIconClassName;
   // }

   const ownerColor = getPlayerData(marker.ownerPlayerID)?.color;
   const color = getIconColor(ownerColor, 0.5);
   
   let style = document.querySelector(`#style-${localIconClassName}-${marker.id}`);
   if (!style) {
       style = document.createElement('style');
       style.id = `style-${localIconClassName}-${marker.id}`;
       document.head.appendChild(style);
   }
   
   style.innerHTML = `
       .marker-icon-${marker.id} {
           background: ${color};
           border-radius: 50%;
           box-shadow: 0 0 5px 3px ${color};
       }
   `;
   
   icon.options.className = `marker-icon-${marker.id}`;
   const player = getPlayerData(marker.ownerPlayerID);

   return (
      <Marker
         icon={icon}
         title={solution?.name}
         key={marker.id}
         position={{ lat: marker.coordinates.lat, lng: marker.coordinates.lng }}
         eventHandlers={{
            click: () => {
               if (voting) {
                  setSelectedMarkerID(marker.id);
               }
               // else will automatically show the popup
            },
         }}
      >
         {!voting && (
            <Popup>
               <Box>
                  <Text fontSize="14px" as="b">{solution?.name}</Text>
                  <Text fontSize="12.5px">
                     {t('solution-info.location')}: {
                        coordsToString(marker.coordinates)
                     } <br />
                     {t('solution-info.price')}: €{solution?.price} <br />
                     {t('solution-info.placed-by')}: {player?.role} <br />
                     {t('solution-info.round-placed')}: {marker.roundIndex + 1} <br />
                     {t('solution-info.vote-count')}: {marker.votes?.length || 0} <br />
                  </Text>
                  {/* Container for buttons */}
                  <Box display="flex" flexDirection="row" alignItems="flex-end"
                     justifyContent="center" gap={2} mt={3}>
                     <Button colorScheme="gray" size="sm"
                        onClick={() =>
                           setSelectedMarkerID(marker.id)
                        }
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
