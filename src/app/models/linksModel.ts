export interface Link {
  id: number;
  name: string;
  link: string;
  description?: string;
  linksGroupId: number;
}

export interface LinksArray {
  links: Link[];
}

export interface Links {
  results: LinksArray;
  status: number;
}
