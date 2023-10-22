import { EventTransport } from './event';

export interface ScheduleTransport {
  events: EventTransport[];
  fitness: number;
}

export interface ScheduleListTransport {
  scheduleTransports: ScheduleTransport[];
}

export class Schedule {
  private _id: number = 0;
  private _events: EventTransport[] = [];
  private _fitness: number = -1;
  private _conflicts: ConflictType[] = [];

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }

  set fitness(fitness: number) {
    this._fitness = fitness;
  }

  get fitness() {
    return this._fitness;
  }

  set events(events: EventTransport[]) {
    this._events = events;
  }

  get events() {
    return this._events;
  }

  get conflicts(): ConflictType[] {
    return this._conflicts;
  }

  set conflicts(value: ConflictType[]) {
    this._conflicts = value;
  }
}

export type ConflictType = {
  event: EventTransport;
  nextEvent: EventTransport;
  message: string;
};
