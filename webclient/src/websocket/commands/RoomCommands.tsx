import * as _ from 'lodash';

import { WebClient } from "../WebClient"; 

export default class RoomCommands {
  private webClient: WebClient;

  constructor(webClient) {
    this.webClient = webClient;
  }

  roomSay(roomId, message) {
    const trimmed = _.trim(message);
    
    if (!trimmed) return;

    var CmdRoomSay = this.webClient.pb.Command_RoomSay.create({
      "message" : trimmed
    });

    var rc = this.webClient.pb.RoomCommand.create({
      ".Command_RoomSay.ext" : CmdRoomSay
    });

    this.webClient.sendRoomCommand(roomId, rc);
  }

  leaveRoom(roomId) {
    var CmdLeaveRoom = this.webClient.pb.Command_LeaveRoom.create();

    var rc = this.webClient.pb.RoomCommand.create({
      ".Command_LeaveRoom.ext" : CmdLeaveRoom
    });

    this.webClient.sendRoomCommand(roomId, rc, (raw) => {
      const { responseCode } = raw;

      switch (responseCode) {
        case this.webClient.pb.Response.ResponseCode.RespOk:
          this.webClient.persistence.room.leaveRoom(roomId);
          break;
        default:
          console.log(`Failed to leave Room ${roomId} [${responseCode}] : `, raw);
      }
    });

  }
}