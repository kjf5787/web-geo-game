// Authors: Vojta Bruza, Grace Houser, and Kayla Fennell
// This end screen displays the final results of the players

import { Box, Center, Heading, HStack, Stack, VStack } from "@chakra-ui/react";
import L from "leaflet";
import '../../Theme/theme.css';
import HomeButton from "../HomeButton";
import SolutionRanking from "./SolutionRanking";
import { useTranslation } from "react-i18next";
import GameMap from "../Play/Map/GameMap";
import { useGameRoom } from "../Contexts/GameRoomContext";
import { useConfig } from "../Contexts/Config";

export default function EndScreen() {
    const { t } = useTranslation();
    const config = useConfig();
    const { roomInfo } = useGameRoom();

    return (
        <HStack align="flex-start" h="100vh">

            {/* Left Sidebar */}
            <VStack
                align="top"
                width={{
                    base: '500px',
                    md: '500px',
                }}
                flexShrink={0}
                h="100vh"
                overflowY="auto"
            >
                {/* Logo at top */}
                {/* <Heading bg="none" pt="5px" textAlign="center"
                    fontSize="18px" color="gray.900" fontWeight="bold">
                    {config.app_name}
                </Heading> */}

                <Center>
                    <Stack spacing={8} mt="40px" mb="80px" align="center" px="4">
                        <Heading size="xl" textAlign="center" color="gray.900" textShadow="0px 0px 8px #444444">
                            {t('results.thank-you')}
                        </Heading>

                        <SolutionRanking />

                        {/* <Button
                            bg="primary.500"
                            color="white"
                            variant="outline"
                            _hover={{ bg: "white", color: "primary.500" }}
                            onClick={() => setCurrentScreen('home')}
                        >
                            Play Again
                        </Button> */}
                    </Stack>
                </Center>

                {/* Home button */}
                <HomeButton />
            </VStack>

            {/* Game Map */}
            <Box flex="1" height="100vh">
                <GameMap polygon={new L.Polygon(roomInfo?.polygonLatLngs)} />
            </Box>

        </HStack>
    );
}