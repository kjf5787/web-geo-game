import { Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
import { global_icon_colors, PlayerData, ProgressState, RoomJoined, RoomPlayersInfo, RoundStage } from './DataTypes';
import { GameRoomProgress } from './GameRoomProgress';
import { MapHandler } from './handlers/MapHandler';
import { TimerHandler } from './handlers/TimerHandler';
import { Player } from './Player';
import { ServerIO } from './ServerIO';

const animals = [
    'Panda',
    'Koala',
    'Dolphin',
    'Penguin',
    'Otter',
    'Bunny',
    'Hedgehog',
    'Fox',
    'Robin',
    'Squirrel',
    'Deer',
    'Meerkat',
    'Cheetah',
    'Fawn',
    'Goldfinch',
    'Butterfly',
    'Hummingbird',
    'Owl',
    'Swan',
    'Beaver',
    'Kangaroo',
    'Llama',
    'Parrot',
    'Seal',
    'Whale',
    'Puffin',
    'Chickadee',
    'Wolf',
    'Flamingo',
    'Badger',
    'Tiger',
    'Leopard',
    'Lion',
    'Eagle',
    'Stork',
    'Raccoon',
    'Chipmunk',
    'Bat',
    'Crane',
    'Toucan',
    'Duck',
    'Goose',
    'Pelican',
    'Albatross',
    'Manatee',
    'Walrus',
    'Sea Lion',
    'Zebra',
    'Horse',
    'Camel',
    'Donkey',
    'Sheep',
    'Goat',
    'Cow',
    'Pig',
    'Dog',
    'Cat',
    'Chameleon',
    'Iguana',
    'Tortoise',
    'Turtle',
    'Octopus',
    'Seahorse',
    'Starfish',
    'Jellyfish',
    'Clownfish',
    'Swordfish',
    'Shark',
    'Elephant',
    'Giraffe',
    'Rhino',
    'Hippo',
    'Antelope',
    'Armadillo',
    'Sloth',
    'Monkey',
    'Gorilla',
    'Orangutan',
    'Chimpanzee',
    'Frog',
    'Toad',
    'Crocodile',
    'Alligator',
    'Peacock',
    'Lynx'
];

const adjectives = [
    'Adventurous',
    'Affectionate',
    'Amazing',
    'Ambitious',
    'Amusing',
    'Awesome',
    'Beautiful',
    'Brave',
    'Bright',
    'Brilliant',
    'Calm',
    'Caring',
    'Charming',
    'Cheerful',
    'Clever',
    'Confident',
    'Considerate',
    'Creative',
    'Curious',
    'Daring',
    'Delightful',
    'Determined',
    'Diligent',
    'Dynamic',
    'Energetic',
    'Enthusiastic',
    'Exceptional',
    'Fabulous',
    'Fantastic',
    'Friendly',
    'Generous',
    'Gentle',
    'Genuine',
    'Graceful',
    'Happy',
    'Hardworking',
    'Helpful',
    'Hilarious',
    'Honest',
    'Imaginative',
    'Incredible',
    'Inspiring',
    'Joyful',
    'Kind',
    'Lively',
    'Loving',
    'Loyal',
    'Magical',
    'Marvelous',
    'Optimistic',
    'Outstanding',
    'Patient',
    'Peaceful',
    'Playful',
    'Positive',
    'Remarkable',
    'Respectful',
    'Smart',
    'Strong',
    'Supportive',
    'Talented',
    'Thoughtful',
    'Unique',
    'Vibrant',
    'Wonderful',
    'Adaptable',
    'Approachable',
    'Astounding',
    'Attentive',
    'Authentic',
    'Balanced',
    'Brilliant',
    'Capable',
    'Charismatic',
    'Classy',
    'Compassionate',
    'Confident',
    'Courteous',
    'Creative',
    'Decisive',
    'Devoted',
    'Empathetic',
    'Empowered',
    'Endearing',
    'Energetic',
    'Engaging',
    'Enlightened',
    'Excellent',
    'Exciting',
    'Fabulous',
    'Fair',
    'Fascinating',
    'Fearless',
    'Fierce',
    'Flawless',
    'Flexible',
    'Flourishing',
    'Forgiving',
    'Friendly',
    'Generous',
    'Gifted',
    'Glowing',
    'Grateful',
    'Grounded',
    'Hardworking',
    'Heartwarming',
    'Helpful',
    'Heroic',
    'Honorable',
    'Humble',
    'Idealistic',
    'Impressive',
    'Inclusive',
    'Independent',
    'Innovative',
    'Inquisitive',
    'Insightful',
    'Inspirational',
    'Invincible',
    'Joyful',
    'Kindhearted',
    'Knowledgeable',
    'Likeable',
    'Logical',
    'Lovable',
    'Mature',
    'Meticulous',
    'Mindful',
    'Modest',
    'Motivated',
    'Noble',
    'Noteworthy',
    'Nurturing',
    'Open-minded',
    'Optimistic',
    'Organized',
    'Original',
    'Outstanding',
    'Passionate',
    'Patient',
    'Perceptive',
    'Persistent',
    'Philosophical',
    'Playful',
    'Polished',
    'Positive',
    'Practical',
    'Proactive',
    'Productive',
    'Protective',
    'Radiant',
    'Rational',
    'Realistic',
    'Reliable',
    'Resilient',
    'Resourceful',
    'Respectful',
    'Responsible',
    'Rewarding',
    'Savvy',
    'Sensible',
    'Sensitive',
    'Serene',
    'Sincere',
    'Skillful',
    'Sociable',
    'Spectacular',
    'Spirited',
    'Steady',
    'Strong',
    'Supportive',
    'Sympathetic',
    'Talented',
    'Thankful',
    'Thoughtful',
    'Tolerant',
    'Trustworthy',
    'Understanding',
    'Unstoppable',
    'Upbeat',
    'Valiant',
    'Versatile',
    'Visionary',
    'Warmhearted',
    'Welcoming',
    'Wise',
    'Witty',
    'Youthful',
    'Zestful'
];

export class GameRoom {
    public id: string;
    private facilitator: string; //player ID of the facilitator
    private players: Map<string, Player>; // Map of playerId to Player instance
    private removedPlayers: Map<string, Player>; // disconnected players
    public roomInitData: RoomJoined;
    // copy the global list of colors for this room
    private availableColors = global_icon_colors.slice();

    private mapHandler: MapHandler;
    private timerHandler: TimerHandler;

    private gameRoomProgress: GameRoomProgress;

    constructor(private ioServer: ServerIO, initialRoomData: RoomJoined, facilitatorID: string) {
        this.id = uuidv4(); // Unique ID for the room
        this.ioServer = ioServer;
        this.players = new Map<string, Player>();
        this.removedPlayers = new Map<string, Player>();
        this.roomInitData = initialRoomData;
        this.facilitator = facilitatorID;
        this.mapHandler = new MapHandler(this.ioServer, this.id);
        this.timerHandler = new TimerHandler(this.ioServer, this.id);
        this.gameRoomProgress = new GameRoomProgress(this.id, initialRoomData.totalRounds);
    }

    // Adds a player to the room
    addPlayer(clientSocket: Socket): void {
        const playerID = this.ioServer.GetPlayerID(clientSocket.id);

        let player: Player;

        if (this.removedPlayers.has(playerID)) {
            // player is rejoining
            player = this.removedPlayers.get(playerID)!;
            this.removedPlayers.delete(playerID);

            // update the player about reconnecting (resent the marker data)
            this.mapHandler.onRejoin(clientSocket);
        } else {
            // if there is no role, then assign the first one (players can have same role)
            const playerRole =
                this.roomInitData.roles.find((role) => {
                    return !Array.from(this.players.values()).some((player) => player.role === role);
                }) || this.roomInitData.roles[0];
            // TODO assign no role at first and then make sure that to role is assigned when starting the game
            // const playerRole = "";

            const color = this.availableColors.find((color) => {
                return !Array.from(this.players.values()).some((player) => player.color === color);
            });

            if (!color) {
                console.warn(`Cannot add player ${playerID} to room ${this.id} due to lack of colors.`);
                return;
            }

            const animal = animals[Math.floor(Math.random() * animals.length)];
            const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
            const name = `${adj} ${animal}`;
            player = new Player(clientSocket, playerRole, color, name, playerID);
        }

        this.players.set(playerID, player);
        clientSocket.join(this.id);
        console.info(`Player ${playerID} joined room ${this.id}`);

        // init the map handler listeners for the new player
        this.mapHandler.startListeners(clientSocket);
        // init the room timer handler
        this.timerHandler.startListeners(clientSocket);

        // Notify all players in the room about the new player
        this.sendPlayersUpdate();
    }

    updatePlayer(playerData: PlayerData) {
        const p = this.getPlayer(playerData.id);
        if (!p) {
            return false;
        }
        if (Array.from(this.players.values()).find((p) => p.color === playerData.color && p.id !== playerData.id)) {
            return false;
        }
        // update from player data
        p.update(playerData);
        // update the player
        this.players.set(p.id, p);
        this.sendPlayersUpdate();
        return true;
    }

    // Removes a player from the room
    removePlayer(playerId: string) {
        const player = this.getPlayer(playerId);
        if (player) {
            // save the player data if the player wants to rejoin later
            this.removedPlayers.set(playerId, player);

            const clientSocket = player.getSocket();

            // remove the player from the room
            clientSocket.leave(this.id);
            this.players.delete(playerId);
            console.info(`Player ${playerId} left room ${this.id}`);

            clientSocket.emit('room-left');

            // Notify remaining players
            this.sendPlayersUpdate();
        }
    }

    private getPlayer(playerId: string) {
        return this.players.get(playerId);
    }

    private sendPlayersUpdate() {
        const roomUpdate: RoomPlayersInfo = {
            players: this.getPlayers()
        };
        this.ioServer.socketServer.to(this.id).emit('room-players-info', roomUpdate);
    }

    // Starts the next round in the game room and notifies all players
    progressGame(): void {
        console.log('Trying to progress game');
        if (this.gameRoomProgress?.getGameProgressState() === ProgressState.NotStarted) {
            if (this.gameRoomProgress.startGame()) {
                // clear the removed players to prevent rejoining kicked players after game start
                this.removedPlayers.clear();
                const roomState = this.gameRoomProgress.getRoomState();
                this.ioServer.socketServer.to(this.id).emit('start-game', roomState);
            }
            return;
        }
        if (this.gameRoomProgress.next()) {
            const roomState = this.gameRoomProgress.getRoomState();
            // notify all players in the room
            this.ioServer.socketServer.to(this.id).emit('room-state', roomState);
            // if any stage is in progress (placing/voting), then start the timer
            if (roomState.round.stageProgress === ProgressState.Finished) {
                this.timerHandler.tryStopTimer();
            } else if (roomState.round.stageProgress === ProgressState.InProgress) {
                let nextTimer = 0;
                switch (roomState.round.stage) {
                    case RoundStage.Placing:
                        nextTimer = this.roomInitData.timeForPlacement;
                        break;
                    case RoundStage.Voting:
                        nextTimer = this.roomInitData.timeForVoting;
                        break;
                    default:
                        break;
                }
                // when the timer finishes, progress the stage again
                console.log(`Starting timer for ${nextTimer} in room ${this.id}.`);
                this.timerHandler.startTimer(nextTimer, () => {
                    this.progressGame();
                });
            }
            // if (roomState.gameState === ProgressState.Finished) {
            //    // TODO cleanup after game end?
            // }
        }
    }

    hadPlayer(playerID: string) {
        return this.removedPlayers.has(playerID);
    }

    hasStarted(): boolean {
        return this.gameRoomProgress.getGameProgressState() !== ProgressState.NotStarted;
    }

    // Checks if the room has reached its maximum player capacity
    isFull(): boolean {
        return this.players.size >= this.roomInitData.maxPlayers;
    }

    // Checks if the room is empty
    isEmpty(): boolean {
        return this.players.size === 0;
    }

    getFacilitatorID(): string {
        return this.facilitator;
    }

    getGameRoomProgress(): GameRoomProgress {
        return this.gameRoomProgress;
    }

    // Returns the current players in the room with their attributes
    getPlayers(): Array<PlayerData> {
        return Array.from(this.players.values()).map((player) => ({
            id: player.id,
            role: player.role,
            color: player.color,
            icon: player.icon,
            name: player.name,
            isFacilitator: player.id === this.facilitator
        }));
    }
}
