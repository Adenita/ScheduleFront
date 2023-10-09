import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProgramTransport, ProgramDetailsTransport } from '../../shared/models/program';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css'],
})
export class ProgramListComponent {
  @Input()
  programs$!: BehaviorSubject<ProgramTransport[] | ProgramDetailsTransport[]>;

  @Input()
  route!: string;
}
