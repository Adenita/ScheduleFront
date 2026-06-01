import { Schedule } from './schedule';

export class Population {
    private _schedules: Schedule[] = [];

    set schedules(schedules: Schedule[]) {
        this._schedules = schedules;
    }

    get schedules() {
        return this._schedules;
    }
}
