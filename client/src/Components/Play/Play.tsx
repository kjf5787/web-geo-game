// Authors: Vojtech Bruza and Grace Houser
// This file pieces together the entire pay screen,
// which includes the left game screen, map, and modals 

import { Box, Heading, HStack, VStack, Divider } from "@chakra-ui/react";
import L from "leaflet";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ProgressState, RoundStage } from "../../data/DataTypes";
import { useConnection } from "../Contexts/ConnectionContext";
import { useGameRoom } from "../Contexts/GameRoomContext";
import Game from "./Game/Game";
import GameMap from "./Map/GameMap";
import PlayModal from "./PlayModal";
import Voting from "./Voting/Voting";
import { useConfig } from "../Contexts/Config";
import PlayerInfoBar from "../PlayerInfoBar";

export default function Play() {
   const { t } = useTranslation();
   const config = useConfig();
   const { roomInfo, gameRoomState, isFacilitator } = useGameRoom();
   const { socket, localPlayerID } = useConnection();
   const isFac = useMemo(() => isFacilitator(localPlayerID), [localPlayerID, isFacilitator]);

   const getModalWindowPopup = () => {
      switch (gameRoomState?.round.stageProgress) {
         case ProgressState.NotStarted:
            switch (gameRoomState.round.stage) {
               case RoundStage.Placing:
                  return <PlayModal
                     title={t('play.modal.start.game.title')}
                     message={[t('play.modal.start.game.message'), t('play.modal.start.game.tip'), t('play.modal.start.game.message2')]}
                     onButtonClick={isFac ? () => { socket.emit('progress-game'); } : undefined} // only pass for facilitator
                     facilitatorButtonText={isFac ? t('play.modal.start.game.button') : undefined}  // same
                  />;
               case RoundStage.Voting:
                  return <PlayModal
                     title={t('play.modal.start.voting.title')}
                     message={[t('play.modal.start.voting.message'), t('play.modal.start.voting.message2')]}
                     onButtonClick={isFac ? () => { socket.emit('progress-game'); } : undefined} // only pass for facilitator
                     facilitatorButtonText={isFac ? t('play.modal.start.voting.button') : undefined}  // same
                  />;
               default:
                  break;
            }
            break;
         case ProgressState.Finished:
            return <PlayModal
               title={t('play.modal.end.title')}
               message={[t('play.modal.end.message')]}
               onButtonClick={isFac ? () => { socket.emit('progress-game'); } : undefined} // only pass for facilitator
               facilitatorButtonText={isFac ? t('play.modal.end.button') : undefined}  // same
            />;
         default:
            break;
      }
   }
   return (
      <>
         {getModalWindowPopup()}
         <HStack bg="primary.500" align="flex-start" h="100vh" gap="0">

            {/* Left Sidebar */}
            <Box
               width={{ base: '300px', md: '300px' }}
               flexShrink={0}
               h="100vh"
               display="flex"
               flexDirection="column"
            >
               {/* Scrollable content */}
               <VStack align="top" flex="1" overflowY="auto">
                  {/* Logo at top */}
                  <Heading bg="none" pt="5px" textAlign="center"
                        fontSize="18px" color="gray.900" fontWeight="bold">
                        {config.app_name}
                  </Heading>

                  {/* Game or voting */}
                  {
                        gameRoomState?.round.stage === RoundStage.Placing
                        &&
                        <Game isFacilitator={isFac} />
                  }
                  {
                        gameRoomState?.round.stage === RoundStage.Voting
                        &&
                        <Voting isFacilitator={isFac} />
                  }
               </VStack>

               {/* Player Info Bar */}
               <Divider/>
               <PlayerInfoBar />
            </Box>

            {/* Game Map */}
            <Box flex="1" height="100vh">
               <GameMap polygon={new L.Polygon(roomInfo?.polygonLatLngs)} />
            </Box>
         </HStack >
      </>
   );
}