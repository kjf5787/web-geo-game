import { Box, Flex, Text, Heading, Divider } from "@chakra-ui/react";
import { useConnection } from "./Contexts/ConnectionContext";
import { useGameRoom } from "./Contexts/GameRoomContext";
import { useGameMarkers } from "./Contexts/GameMarkersContext";
import Icon from "./Lobby/Icon";

export default function PlayerInfoBar() {
    const { localPlayerID } = useConnection();
    const { getPlayerData, roomInfo } = useGameRoom();
    const { getPlayerSpentBudget } = useGameMarkers();

    const player = getPlayerData(localPlayerID);
    const spent = getPlayerSpentBudget(localPlayerID);

    if (!player) return null;

    return (
        <Box pb="10px" width="100%">
            <Flex align="center" pt="10px">
                <Icon color={player.color} icon={player.icon} />
                <Box>
                    <Heading size="sm" color="gray.900">{player.name}</Heading>
                    <Text fontSize="12px" color="gray.900">Spent: €{spent}</Text>
                </Box>
            </Flex>
        </Box>
    );
}