export interface Task {
  id: number;
  title: string;
  description: string;
  dateBegin: Date;
  isRecurring: boolean;
  recurrence: string;
  MemberId?:number[];
}

export interface Tasks {
  tasks: Task[];
}

export interface ResAllTask {
  result: Tasks;
  status: number;
}

export interface ResultOneTask {
  task: Task[];
}

export interface ResOneTask {
  result: ResultOneTask;
  status: number;
}

export interface Meet {
  id: number;
  title: string;
  description: string;
  dateBegin: Date;
  dateEnding: Date;
  isRecurring: boolean;
  recurrence: string;
  source: string;
  MemberId?:number[];
  linkOrLocalisation: string;
}

export interface Meets {
  meets: Meet[];
}

export interface ResAllMeet {
  result: Meets;
  status: number;
}

export interface ResultOneMeet {
  meet: Meet[];
}

export interface ResOneMeet {
  result: ResultOneMeet;
  status: number;
}

export interface GoogleEvent {
  id?: string;
  summary?: string;
  description?: string;
  start?: {
      date?: string;
      dateTime?: string;
      timeZone?: string;
  }
  end?: {
      date?: string;
      dateTime?: string;
      timeZone?: string;
  }
}

export interface GoogleEvents {
  meets: GoogleEvent[];
}

export interface ResAllGoogleEvent {
  result: GoogleEvents;
  status: number;
}