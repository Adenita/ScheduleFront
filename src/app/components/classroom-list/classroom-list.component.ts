import {Component, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Classroom} from "../../shared/models/classroom";

@Component({
  selector: 'app-classroom-list',
  templateUrl: './classroom-list.component.html',
  styleUrls: ['./classroom-list.component.css']
})
export class ClassroomListComponent {
  @Input()
  classrooms$!: BehaviorSubject<Classroom[]>;
}
