export interface Classroom {
  id: number;
  name: string;
  numberOfSeats: number;
  hasComputers: boolean;
  creationDate: Date;
  modificationDate: Date;
}

export interface ClassroomTransport {
  classrooms: Classroom[];
}
