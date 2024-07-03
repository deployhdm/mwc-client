import { PermissionLevel } from "./collaboratorModel";

export interface Note {
  id: number;
  title: string;
  content: string;
  collaboratorCount: number;
  permissionLevel?: keyof typeof PermissionLevel;
}

export interface NotesArray {
  notes: Note[];
}

export interface Notes {
  result: NotesArray;
  status: number;
}
