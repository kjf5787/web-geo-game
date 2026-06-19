// Authors: Vojta Bruza, Grace Houser, and Kayla Fennell
// This file displays the cards of the players ranked

import { Card, CardBody, Center, Heading, Text, VStack } from "@chakra-ui/react";
import '../../Theme/theme.css';
import Icon from "../Lobby/Icon";
import { useGameRoom } from "../Contexts/GameRoomContext";
import { useGameMarkers } from "../Contexts/GameMarkersContext";
import { getSolution } from "../../data/data";
import { useTranslation } from "react-i18next";
import { useRankedPlayers } from "./useRankedPlayers";

export default function PlayerRanking() {
    const { t } = useTranslation();
    const rankedPlayers = useRankedPlayers();

    return (
        <Center>
            <VStack overflow="auto" spacing="2px">
                {
                    rankedPlayers.map((player) => (
                        <Card
                            direction="row"
                            bg="white"
                            color="gray.900"
                            mb="5px"
                            align="center"
                            key={player.id}
                            height="100px"
                            width="100%"
                        >
                            <Icon color={player.color} />
                            <CardBody p="10px" pr="80px">
                                <Heading size='md'> {player.name} </Heading>
                                <Text fontSize="12px"> {player.role} </Text>
                            </CardBody>
                            <CardBody>
                                <Text fontWeight="bold">
                                    {t('results.score')}: {player.votes}
                                </Text>
                                <Text fontWeight="bold">
                                    {t('results.spent')}: €{player.spent}
                                </Text>
                            </CardBody>
                        </Card>
                    ))
                }
            </VStack>
        </Center>
    );
}
