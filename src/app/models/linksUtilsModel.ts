export interface MenuDisplay {
  id: number;
  display: boolean;
}

export interface MenuTextDisplay {
  id: string;
  display: boolean;
}

export interface TryToAddALink {
  id: number;
  display: boolean;
}

export interface AddALink {
  name: string;
  link: string;
  linksGroupId: number;
}
