import {Component, Input} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Program, ProgramDetails} from "../../shared/models/program";

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent {
  @Input()
  programs$!: BehaviorSubject<Program[] | ProgramDetails[]>;

  @Input()
  departmentId!: number;
}
