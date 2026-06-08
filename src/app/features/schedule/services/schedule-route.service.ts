import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

type RouteCommand = string | number;
type ScheduleEntity = 'classrooms' | 'programs' | 'professors';

@Injectable({
    providedIn: 'root',
})
export class ScheduleRouteService {
    getDepartmentId(route: ActivatedRoute): number {
        const departmentRoute = route.pathFromRoot.find((routeSegment) => routeSegment.snapshot.paramMap.has('id'));
        return Number(departmentRoute?.snapshot.paramMap.get('id')) || -1;
    }

    getScheduleEntityRoute(departmentId: number, scheduleId: number, entity: ScheduleEntity, entityId: number): RouteCommand[] {
        if (departmentId !== -1) {
            return ['departments', departmentId, 'schedules', scheduleId, entity, entityId];
        }

        return ['schedules', scheduleId, entity, entityId];
    }
}
