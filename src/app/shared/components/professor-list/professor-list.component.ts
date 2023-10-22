import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfessorTransport } from '../../models/professor';

@Component({
  selector: 'app-professor-list',
  templateUrl: './professor-list.component.html',
  styleUrls: ['./professor-list.component.css'],
})
export class ProfessorListComponent {
  @Input()
  professors$!: BehaviorSubject<ProfessorTransport[]>;

  @Input()
  route!: string;
}
