import { Component, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StudentGroupTransport } from '../../../../../shared/models/student-group';

@Component({
  selector: 'app-student-group-list',
  templateUrl: './student-group-list.component.html',
  styleUrls: ['./student-group-list.component.css'],
})
export class StudentGroupListComponent {
  @Input()
  studentGroups$!: BehaviorSubject<StudentGroupTransport[]>;

  @Input()
  route!: string;
}
