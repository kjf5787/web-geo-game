// Authors: Kayla Fennell

import { useGameRoom } from "../Contexts/GameRoomContext";
import { useGameMarkers } from "../Contexts/GameMarkersContext";
import { getSolution } from "../../data/data";

export function useRankedPlayers() {
    const { players } = useGameRoom();
    const { markers } = useGameMarkers();

    return players
        .map((player) => {
            const { votes, spent } = markers.reduce(
                (acc, marker) => {
                    if (marker.ownerPlayerID === player.id) {
                        acc.votes += marker.votes.length;
                        acc.spent += getSolution(marker.solutionID)?.price || 0;
                    }
                    return acc;
                },
                { votes: 0, spent: 0 }
            );
            return { ...player, votes, spent };
        })
        .sort((a, b) => b.votes - a.votes || a.spent - b.spent);
}