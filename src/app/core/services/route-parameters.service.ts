import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { BehaviorSubject, combineLatest, filter, map, Observable, startWith, Subject, take, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteParametersService {
  private _departmentId: number | null = null;
  private _programId: number | null = null;
  private _professorId: number | null = null;
  private _subjectId: number | null = null;
  private _studentGroupId: number | null = null;
  private _classroomId: number | null = null;
  private _scheduleId: number | null = null;
  private _departmentSchedulesId: number | null = null;
  called: boolean = false;

  currentRoute: string = '';
  currentRoute$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  getNavigationEvent(router: Router, activatedRoute: ActivatedRoute, destroyed$: Subject<void>): Observable<void> {
    return new Observable<void>((observer) => {
      // Immediately extract from current route
      this.currentRoute = router.url;
      this.setIdsFromRoute(this.currentRoute);
      this.currentRoute$.next(this.currentRoute);
      observer.next();

      // Subscribe to future navigation events
      const subscription = router.events
        .pipe(
          filter((routerEvent) => routerEvent instanceof NavigationEnd || routerEvent instanceof Scroll),
          takeUntil(destroyed$),
        )
        .subscribe((event) => {
          const eventUrl = event && 'url' in event ? event.url : null;

          if (eventUrl) {
            this.currentRoute = eventUrl;
          } else {
            this.currentRoute = router.url;
          }

          this.setIdsFromRoute(this.currentRoute);
          this.currentRoute$.next(this.currentRoute);
          observer.next();
        });

      return () => subscription.unsubscribe();
    });
  }

  getCurrentRoute(activatedRoute: ActivatedRoute) {
    return new Promise<void>((resolve) => {
      activatedRoute.params.pipe(take(1)).subscribe((params) => {
        // @ts-ignore
        this.currentRoute = activatedRoute.snapshot['_routerState'].url;
        this.setIdsFromRoute(this.currentRoute);
        this.currentRoute$.next(this.currentRoute);
        resolve();
      });
    });
  }

  setIdsFromRoute(route: string) {
    const parts = route.split('/');

    const departmentsIndex = parts.indexOf('departments');
    const programsIndex = parts.indexOf('programs');
    const professorsIndex = parts.indexOf('professors');
    const selfIndex = parts.indexOf('self');
    const subjectsIndex = parts.indexOf('subjects');
    const classroomsIndex = parts.indexOf('classrooms');
    const schedulesIndex = parts.indexOf('schedules');
    const studentGroupsIndex = parts.indexOf('student-groups');
    const departmentSchedulesIndex = parts.indexOf('generate');

    this._departmentId = +parts[departmentsIndex + 1] || null;
    this._programId = +parts[programsIndex + 1] || null;
    this._professorId = +parts[professorsIndex + 1] || +parts[selfIndex + 1] || null;
    this._subjectId = +parts[subjectsIndex + 1] || null;
    this._scheduleId = +parts[schedulesIndex + 1] || null;
    this._classroomId = +parts[classroomsIndex + 1] || null;
    this._studentGroupId = +parts[studentGroupsIndex + 1] || null;
    this._departmentSchedulesId = +parts[departmentSchedulesIndex + 1] || null;
  }

  getRouteParams(activatedRoute: ActivatedRoute): Promise<void> {
    return new Promise<void>((resolve) => {
      activatedRoute.params.subscribe((params) => {
        this._departmentId = +params['id'] || null;
        this._programId = +params['pid'] || null;
        this._professorId = +params['ppid'] || null;
        this._subjectId = +params['sid'] || null;
        this._studentGroupId = +params['ssid'] || null;
        this._classroomId = +params['cid'] || null;
        this._scheduleId = +params['scid'] || null;
        resolve();
      });
    });
  }

  setRoute(lastRoute: string): string {
    let route: string = '';

    if (this.departmentId != -1) {
      route += '/departments/' + this.departmentId;
    }

    if (this.scheduleId != -1) {
      route += '/schedules/' + this.scheduleId;
    }

    if (this.classroomId != -1) {
      route += '/classrooms/' + this.classroomId;
    }

    if (this.programId != -1) {
      route += '/programs/' + this.programId;
    }

    if (this.professorId != -1) {
      route += '/professors/' + this.professorId;
    }

    if (this.subjectId != -1) {
      route += '/subjects/' + this.subjectId;
    }

    if (this.studentGroupId != -1) {
      route += '/students_groups/' + this.studentGroupId;
    }

    route += '/' + lastRoute;
    return route;
  }

  get departmentId(): number {
    return this._departmentId ?? -1;
  }

  get programId(): number {
    return this._programId ?? -1;
  }

  get professorId(): number {
    return this._professorId ?? -1;
  }

  get subjectId(): number {
    return this._subjectId ?? -1;
  }

  get studentGroupId(): number {
    return this._studentGroupId ?? -1;
  }

  get scheduleId(): number {
    return this._scheduleId ?? -1;
  }

  get classroomId(): number {
    return this._classroomId ?? -1;
  }

  get departmentSchedulesId(): number {
    return this._departmentSchedulesId ?? -1;
  }
}
