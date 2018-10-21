export interface ICallEventNotification {
  callingParticipant: string
  calledParticipant: string
  callSessionIdentifier: string
  timestamp: number
  notificationType: "CallDirection"
  eventDescription: {
    callEvent: ICallEvent
  }
}

export interface IWebSocketPackage {
  callEvent: ICallEvent
}

export const enum ICallEvent {
  CalledNumber = "CalledNumber",
  NoAnswer = "NoAnswer",
  Busy = "Busy",
  Disconnected = "Disconnected",
  NotReachable = "NotReachable"
}

export interface ICallActionResponse {
  action: {
    actionToPerform: string
    displayAddress: string
  }
}

export const enum CallAction {
  EndCall = "EndCall",
  Continue = "Continue",
  Route = "Route",
  PlayAudio = "PlayAudio"
}
