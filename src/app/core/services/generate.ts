import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Generate {
  private _generate: boolean = false;

  get generate(): boolean {
    return this._generate;
  }

  set generate(value: boolean) {
    this._generate = value;
  }
}
