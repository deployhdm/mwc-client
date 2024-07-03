export interface Notepad {
  content: string;
}

export interface Result {
  notepad: Notepad;
}

export interface RootObject {
  result: Result;
  status: number;
}
