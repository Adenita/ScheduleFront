export interface StudentGroupTransport {
    id: number;
    name: string;
    numberOfStudents: number;
    groupType: GroupType;
    semester: number;
    creationDate: Date;
    modificationDate: Date;
}

export enum GroupType {
    LECTURE = 'Lecture',
    EXERCISE = 'Exercise',
}

export interface StudentGroupListTransport {
    studentGroupTransportList: StudentGroupTransport[];
}
