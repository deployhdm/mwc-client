export interface Receive {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isAdmin: number;
}

export interface Send {
  id: number;
  senderInvitationId: number;
  reiceverInvitationEmail: string;
}

export interface AllInvitation {
  receive: Receive[];
  send: Send[];
}

export interface ResInvitation {
  result: AllInvitation;
  status: number;
}
