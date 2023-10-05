import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RouteParametersService {
  private _departmentId: number | null = null;
  private _programId: number | null = null;

  getRouteParams(route: ActivatedRoute) {
    route.params.subscribe(params => {
      this._departmentId = params['id'] ? +params['id'] : null;
      this._programId = params['pid'] ? +params['pid'] : null;
    });
  }


  get departmentId(): number  {
    return this._departmentId ?? -1;
  }

  get programId(): number {
    return this._programId ?? -1;
  }
}
