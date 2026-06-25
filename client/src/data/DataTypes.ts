/* eslint-disable @typescript-eslint/no-explicit-any */
// Color List
export const global_icon_colors = ["red", "orange", "yellow", "green", "turqoise", "blue", "purple", "pink"];

// TODO use this generic message everywhere?
export interface Message {
   status: "ok" | "error";
   error?: any;
   data?: any;
}

export interface PlayerData {
   id: string;
   role: string;
   color: string;
   icon: string;
   name: string;
   isFacilitator: boolean;
}

// initial data to setup the room
export interface RoomJoined {
   name: string;
   polygonLatLngs: any;
   solutionIDs: string[];
   roles: string[];
   timeForPlacement: number;
   timeForVoting: number;
   initialBudget: number;
   totalRounds: number;
   // max votes per player per round
   maxVotes: number;
   maxMarkers: number;
   maxPlayers: number;
}

export interface RoomInfo {
   id: string;
   data: RoomJoined;
   roomState: GameRoomState;
}

// sent to all users in one room when something changes
export interface RoomPlayersInfo {
   players: PlayerData[];
}

export interface PlayerInfoUpdate {
   player: PlayerData;
}

export interface Solution {
   id: string;
   name: string;
   description: string;
   image: string;
   price: number;
   default: boolean; // should it be checked by default when creating a room
   roundIcon: boolean;
}

//// GAME PROGRESS TYPES

// can probably be used both for the game itself and each round stage as well
export enum ProgressState {
   NotStarted,
   InProgress,
   Finished,
}

export enum RoundStage {
   Placing,
   Voting,
}

export type Dictionary<K extends string | number | symbol, V> = {
   [Key in K]: V;
}

// the serializable version of the room progress
// send when a new player joins
export interface GameRoomState {
   id: string;
   // lobby/not started, in progress, or finished
   gameState: ProgressState;
   // which round and in which state are we in
   round: RoundState;
   // custom dictionary of player IDs to their budget
   // playerBudgets: Dictionary<string, number>;
}

export interface RoundState {
   index: number;
   stage: RoundStage;
   stageProgress: ProgressState;
}

//// MAP

export interface CustomLatLng {
   lat: number;
   lng: number;
}

export interface MapMarkerData {
   id: number;
   coordinates: CustomLatLng;
   solutionID: string;
   ownerPlayerID: string;
   roundIndex: number;
   votes: Vote[];
}

export interface Vote {
   // what
   markerID: number;
   // who
   playerID: string;
   // when
   roundIndex: number;
}
