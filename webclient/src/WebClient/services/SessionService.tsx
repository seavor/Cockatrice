import { Dispatch, ServerConnectParams } from 'store/server';
import { StatusEnum } from 'types';

import { sanitizeHtml } from '../util';
import { WebClient } from '../WebClient';

export class SessionService {
  webClient: WebClient;

  constructor(webClient) {
    this.webClient = webClient;
  }

  clearStore() {
    Dispatch.clearStore();
  }

  // @TODO determine proper connect status tracking
  connectServer(options: ServerConnectParams) {
    Dispatch.connectServer();
    this.webClient.connect(options);
    this.webClient.updateStatus(StatusEnum.CONNECTING, 'Connecting...');
  }

  disconnectServer() {
    this.webClient.updateStatus(StatusEnum.DISCONNECTING, 'Disconnecting...');
    this.webClient.disconnect();
  }

  connectionClosed(reason) {
    Dispatch.connectionClosed(reason);
  }

  updateInfo(name, version) {
    Dispatch.updateInfo(name, version);
  }

  updateStatus(state, description) {
    Dispatch.updateStatus(state, description);

    // @TODO determine if this is desired
    // if (state === StatusEnum.DISCONNECTED) {
    //   Dispatch.connectionClosed({
    //     reason: description
    //   });
    // }
  }

  updateUser(user) {
    Dispatch.updateUser(user);
  }

  updateUsers(users) {
    Dispatch.updateUsers(users);
  }

  userJoined(user) {
    Dispatch.userJoined(user);
  }

  userLeft(userId) {
    Dispatch.userLeft(userId);
  }

  serverMessage(message) {
    Dispatch.serverMessage(sanitizeHtml(message));
  }
}
