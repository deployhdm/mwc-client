export enum PermissionLevel  {
    READ = 'Peut afficher',
    WRITE = 'Peut modifier',
    WRITE_AND_SHARE = 'Peut modifier et partager',
}

export interface Collaborator {
    id: number;
    email: string;
    permissionLevel: PermissionLevel;
    isUserRegistered: boolean;
}

export interface CollaboratorsArray {
    collaborators: Collaborator[];
}

export interface Collaborators {
    result: CollaboratorsArray
    status: number;
}