import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { SubjectDetailsTransport, SubjectTransport } from '../../shared/models/subject';

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css'],
})
export class SubjectListComponent {
  @Input()
  subjects$!: BehaviorSubject<SubjectTransport[] | SubjectDetailsTransport[]>;
}
