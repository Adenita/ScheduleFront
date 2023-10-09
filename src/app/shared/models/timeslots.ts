export interface Timeslot {
  id: number;
  day: DAY;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
}

export interface TimeslotsTransport {
  timeSlots: Timeslot[]
}

export enum DAY {
  MON = "Monday",
  TUE = "Tuesday",
  WED = "Wednesday",
  THU = "Thursday",
  FRI = "Friday"
}
