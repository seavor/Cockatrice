import { WebClient } from '../WebClient'; 

export class SessionCommands {
  private webClient: WebClient;

  constructor(webClient) {
    this.webClient = webClient;
  }

  fetchRooms() {
    const CmdListRooms = this.webClient.pb.Command_ListRooms.create();

    const sc = this.webClient.pb.SessionCommand.create({
      ".Command_ListRooms.ext" : CmdListRooms
    });

    this.webClient.sendSessionCommand(sc);
  }

  joinRoom(roomId: string) {
    const CmdJoinRoom = this.webClient.pb.Command_JoinRoom.create({
      "roomId" : roomId
    });

    const sc = this.webClient.pb.SessionCommand.create({
      ".Command_JoinRoom.ext" : CmdJoinRoom
    });

    this.webClient.sendSessionCommand(sc, (raw) => {
      const { responseCode } = raw;

      let error;

      switch(responseCode) {
        case this.webClient.pb.Response.ResponseCode.RespOk:
          const { roomInfo } = raw['.Response_JoinRoom.ext'];

          // @TODO join room to store
          this.webClient.services.rooms.joinRoom(roomInfo.roomId);
          this.webClient.debug(() => console.log('Join Room: ', roomInfo.name));
          return;
        case this.webClient.pb.Response.ResponseCode.RespNameNotFound:
          error = "Failed to join the room: it doesn't exist on the server.";
          break;
        case this.webClient.pb.Response.ResponseCode.RespContextError:
          error = "The server thinks you are in the room but Cockatrice is unable to display it. Try restarting Cockatrice.";
          break;
        case this.webClient.pb.Response.ResponseCode.RespUserLevelTooLow:
          error = "You do not have the required permission to join this room.";
          break;
        default:
          error = "Failed to join the room due to an unknown error.";
          break;
      }
      
      if (error) {
        console.error(responseCode, error);
      }
    });
  }
}