// Authors: Vojtech Bruza and Grace Houser

import { Box, Button, Card, CardBody, Heading, Image, Link, Text, VStack } from "@chakra-ui/react";
import { createObjectCsvStringifier } from "csv-writer";
import { getSolution, global_solutions } from "../../data/data";
import '../../Theme/theme.css';
import { useGameMarkers } from "../Contexts/GameMarkersContext";
import { useGameRoom } from "../Contexts/GameRoomContext";
import { getIconColor } from "../Lobby/Icon";
import { getSolutionImagePath } from "../Play/Game/SolutionInfoCard";
import { CustomLatLng } from "../../data/DataTypes";
import { useTranslation } from "react-i18next";
import { useLocalGameData } from "../Contexts/LocalGameContext";

export function getOSMLink(coordinates: CustomLatLng) {
   return `https://www.openstreetmap.org/?mlat=${coordinates.lat}&mlon=${coordinates.lng}#map=15/${coordinates.lat}/${coordinates.lng}`;
}

export default function SolutionRanking() {

   const { t } = useTranslation();
   const { markers } = useGameMarkers();
   const { getPlayerData, players, roomInfo } = useGameRoom();
   const { setSelectedMarkerID, selectedMarkerID } = useLocalGameData();

   const downloadFile = (dataStr: string, format: "csv" | "json") => {
      const downloadString = `data:text/${format};charset=utf-8,` + encodeURIComponent(dataStr);
      const downloadAnchorNode = document.createElement('a');
      // set timestamp for file name
      const date = new Date();
      const pad = (num: number) => num.toString().padStart(2, '0');
      const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}_${pad(date.getHours())}-${pad(date.getMinutes())}`;
      downloadAnchorNode.setAttribute("href", downloadString);
      downloadAnchorNode.setAttribute("download", `voting - ${dateStr}.${format}`);
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
   }

   const exportDataJSON = () => {
      // can by directly exported as json
      const data = {
         markers,
         players,
         roomInfo,
         global_solutions
      };
      downloadFile(JSON.stringify(data), "json");
   };

   const exportMarkersCSV = () => {
      // write to csv using https://www.npmjs.com/package/csv-writer
      const csvStringifier = createObjectCsvStringifier({
         header: [
            { id: 'marker_id', title: 'Marker ID' },
            { id: 'link', title: 'Link to OSM' },
            { id: 'lat', title: 'Latitude' },
            { id: 'lng', title: 'Longitude' },
            { id: 'placed_in', title: 'Placed in Round' },
            { id: 'num_votes', title: 'Votes Count' },
            { id: 'voted_by_in', title: 'Voted by (in Round)' },
            { id: 'solution_name', title: 'Solution (Name)' },
            { id: 'solution_id', title: 'Solution (ID)' },
            { id: 'solution_cost', title: 'Solution Cost' },
            { id: 'placed_by_name', title: 'Placed by (Name)' },
            { id: 'placed_by_role', title: 'Placed by (Role)' },
            { id: 'placed_by_color', title: 'Placed by (Color)' },
         ]
      });

      // declare rows array
      const records: {
         marker_id: string, link: string, lat: string, lng: string, placed_in: string, num_votes: string
         voted_by_in: string, solution_name: string, solution_id: string, solution_cost: string,
         placed_by_name: string, placed_by_role: string, placed_by_color: string
      }[] = [];

      // write each marker as a new line
      markers.sort((a, b) => b.votes.length - a.votes.length).forEach((m) => {
         const solution = getSolution(m.solutionID);
         const placedBy = getPlayerData(m.ownerPlayerID);
         const votedByIn_str = m.votes.map((v) => {
            const p = getPlayerData(v.playerID);
            return `${p?.name} - ${p?.role} (round ${v.roundIndex + 1})`;
         }).join(', ');
         records.push({
            marker_id: m.id.toString(),
            link: getOSMLink(m.coordinates),
            lat: m.coordinates.lat.toString(),
            lng: m.coordinates.lng.toString(),
            placed_in: (m.roundIndex + 1).toString(),
            num_votes: m.votes.length.toString(),
            voted_by_in: votedByIn_str,
            solution_name: solution!.name,
            solution_id: solution!.id,
            solution_cost: solution!.price.toString(),
            placed_by_name: placedBy?.name + (placedBy?.isFacilitator ? " (facilitator)" : ""),
            placed_by_role: placedBy!.role,
            placed_by_color: placedBy!.color
         });
      });

      const fullCSV_str = csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(records);
      downloadFile(fullCSV_str, "csv");
   };

   return (
      <VStack overflow="auto" spacing="2px">
         {
            markers && markers.sort((a, b) => b.votes.length - a.votes.length).map((marker) => {
               const sol = getSolution(marker.solutionID)!;
               const solImg = getSolutionImagePath(sol.image);
               return (
                  // TODO make it responsive
                  <Card
                     direction={{ base: 'column', sm: 'row' }}
                     key={marker.id}
                     maxWidth={{ base: '90%', sm: '90%', md: '800px', lg: '1000px' }} // Adjusts based on screen size
                     width="100%" // Full width by default
                     bg="white"
                     color="gray.900"
                     mb="5px"
                     align="center"
                     onClick={() => setSelectedMarkerID(selectedMarkerID === marker.id ? null : marker.id)}
                     cursor="pointer"
                     border={selectedMarkerID === marker.id ? "2px solid" : "2px solid transparent"}
                     borderColor={selectedMarkerID === marker.id ? getIconColor(getPlayerData(marker.ownerPlayerID)?.color) : "transparent"}
                  >
                     <Box
                        backgroundColor={getIconColor(getPlayerData(marker.ownerPlayerID)?.color) || "white"}
                        borderRadius="50%"
                        display="inline-block"
                        padding="5px"
                        width="80px"
                        height="80px"
                        m="20px"
                     >
                        {
                           solImg ?
                              <Image
                                 alt="Player" borderRadius="50%"
                                 width="100%" height="100%"
                                 src={solImg}
                              />
                              :
                              <Box
                                 backgroundColor="gray.300"
                                 borderRadius="50%"
                                 width="100%"
                                 height="100%"
                              />
                        }
                     </Box>

                     <CardBody p="10px" pr="10px">
                        <Heading size='md'> {sol.name} </Heading>
                        <Text fontSize="12px"> {t('solution-info.placed-by')}: {getPlayerData(marker.ownerPlayerID)?.name}, {getPlayerData(marker.ownerPlayerID)?.role} </Text>
                        <Text fontSize="12px"> {t('solution-info.price')}: {sol.price} </Text>
                        <Link
                           href={getOSMLink(marker.coordinates)}
                           target="_blank" rel="noopener noreferrer"
                           fontSize="12px"
                           style={{ textDecoration: "underline" }}
                        >
                           {t('solution-info.show')}
                        </Link>
                     </CardBody>

                     <CardBody p="10px" pr="20px" flex="0" whiteSpace="nowrap">
                        <Text fontWeight="bold">
                           {t('solution-info.votes')}: {marker.votes.length}
                        </Text>
                     </CardBody>
                  </Card>
               )
            }
            )
         }
         <Button variant="solid" onClick={exportMarkersCSV}>
            {t('results.export')} (CSV)
         </Button>
         <Button variant="solid" onClick={exportDataJSON}>
            {t('results.export')} (JSON)
         </Button>
      </VStack>
   );
}
