export interface Classroom {
  id: number;
  name: string;
  numberOfSeats: number;
  hasComputers: boolean;
}

export interface ClassroomTransport {
  classrooms: Classroom[]
}
