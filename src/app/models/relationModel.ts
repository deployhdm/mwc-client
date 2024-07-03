export interface Relation {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  isAdmin: number;
  isChecked?:boolean;
  isCheckedBlock:boolean;
}

export interface Relations {
  friends: Relation[];
}

export interface ResRelation {
  result: Relations;
  status: number;
}
