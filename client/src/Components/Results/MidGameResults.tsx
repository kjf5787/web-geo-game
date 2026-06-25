// Authors: Vojta Bruza, Grace Houser, and Kayla Fennell
// Results Page

import { Box, Button, Center, Text, HStack, VStack, Heading } from "@chakra-ui/react";
import { useMemo, useEffect, useState } from "react";
import { useConnection } from "../Contexts/ConnectionContext";
import { useGameRoom } from "../Contexts/GameRoomContext";
import PlayerRanking from "./PlayerRanking";
import { useTranslation } from "react-i18next";
import { useRankedPlayers } from "./useRankedPlayers";
// import Confetti from 'react-confetti'
import L from "leaflet";
import GameMap from "../Play/Map/GameMap"
import { useConfig } from "../Contexts/Config";
import { useLocalGameData } from "../Contexts/LocalGameContext";

export default function MidGameResults() {
    const { t } = useTranslation();
    const config = useConfig();
    const { isFacilitator, roomInfo } = useGameRoom();
    const { socket, localPlayerID } = useConnection();
    const { setSelectedMarkerID, setSelectedPlayerID } = useLocalGameData();
    const rankedPlayers = useRankedPlayers();
    const isTopOfList = useMemo(
        () => rankedPlayers[0]?.id === localPlayerID,
        [rankedPlayers, localPlayerID]
    );
    // const [showConfetti, setShowConfetti] = useState(false);

    const isFac = useMemo(() => isFacilitator(localPlayerID), [localPlayerID, isFacilitator]);

    // useEffect(() => {
    //     if (isTopOfList) {
    //         setShowConfetti(true);
    //     }
    // }, [isTopOfList]);

    return (
        <>
            {/* {showConfetti && (
                <Confetti
                    width={window.innerWidth}
                    height={window.innerHeight}
                    recycle={false}
                    gravity={0.15}
                    onConfettiComplete={() => setShowConfetti(false)}
                />
            )} */}

            <HStack align="flex-start" h="100vh">

                {/* Left Sidebar */}
                <VStack
                    align="top"
                    width={{
                        base: '450px',
                        md: '450px',
                    }}
                    flexShrink={0}
                    h="100vh"
                    overflowY="auto"
                >
                    {/* Logo at top */}
                    <Heading bg="none" pt="5px" textAlign="center"
                        fontSize="18px" color="gray.900" fontWeight="bold">
                        {config.app_name}
                    </Heading>

                    {/* Page Title */}
                    <Center>
                        <Text pt="20px"
                            fontSize="3xl" fontWeight="bold" color="primary.500">
                            {t('results.results')}
                        </Text>
                    </Center>

                    <Center>
                        <Text pb="10px" align="center" px="10px"
                            fontSize="sm" color="gray.900">
                            {isFac ? t('results.click-to-progress') : t('results.check-score')}
                        </Text>
                    </Center>

                    {/* Rankings Section */}
                    <Box
                        overflowY="auto"
                        flex="1"
                        borderRadius="5px"
                        padding="3"
                        width="100%"
                    >
                        <PlayerRanking />
                    </Box>

                    {/* Next Button */}
                    <Center pb="20px">
                        {isFac &&
                            <Button
                                bg='primary.500' color="white"
                                _hover={{ bg: "white", color: "primary.500", borderColor: "primary.500", borderWidth: "2px" }}
                                onClick={() => { socket.emit('progress-game'); }}>
                                {t('generic.continue')}
                            </Button>
                        }
                    </Center>
                </VStack>

                {/* Game Map */}
                <Box flex="1" height="100vh" onClick={() => { setSelectedMarkerID(null); setSelectedPlayerID(null); }}>
                    <GameMap polygon={new L.Polygon(roomInfo?.polygonLatLngs)} />
                </Box>

            </HStack>
        </>
    );
}