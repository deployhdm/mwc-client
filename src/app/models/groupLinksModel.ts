import { PermissionLevel } from "./collaboratorModel";

export interface LinksGroup {
  id: number;
  name: string;
  description: string;
  member: string;
  permissionLevel?: keyof typeof PermissionLevel; 
}

export interface LinksGroupArray{
  linksGroup: LinksGroup[];
}

export interface LinksGroups {
  results: LinksGroupArray;
  status: number;
}
