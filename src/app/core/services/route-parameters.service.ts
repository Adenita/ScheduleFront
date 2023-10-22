import { Injectable } from '@angular/core';
import { ActivatedRoute, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteParametersService {
  private _departmentId: number | null = null;
  private _programId: number | null = null;
  private _professorId: number | null = null;
  private _subjectId: number | null = null;
  private _studentGroupId: number | null = null;

  getRouteParams(activatedRoute: ActivatedRoute): Promise<void> {
    return new Promise<void>((resolve) => {
      activatedRoute.params.subscribe((params) => {
        this._departmentId = +params['id'] || null;
        this._programId = +params['pid'] || null;
        this._professorId = +params['ppid'] || null;
        this._subjectId = +params['sid'] || null;
        this._studentGroupId = +params['ssid'] || null;
        resolve();
      });
    });
  }

  setRoute(lastRoute: string): string {
    let route: string = '';

    if (this.departmentId != -1) {
      route += '/departments/' + this.departmentId;
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
}
