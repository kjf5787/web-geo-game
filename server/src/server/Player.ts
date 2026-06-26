import { Socket } from 'socket.io';
import { PlayerData } from './DataTypes';

export class Player {
   // TODO use player data from the shared project?
   public id: string;
   public role: string;
   public color: string;
   public icon: string;
   public name: string;
   private socket: Socket;

   constructor(socket: Socket, role: string, color: string, name: string, id: string) {
      this.id = id;
      this.role = role;
      this.color = color;
      this.icon = "FaUser";
      this.name = name;
      this.socket = socket;
   }

   update(playerData: PlayerData) {
      this.name = playerData.name;
      this.color = playerData.color;
      this.icon = playerData.icon;
      this.role = playerData.role;
   }

   // Method to retrieve player's socket for emitting messages, etc.
   getSocket(): Socket {
      return this.socket;
   }
}
