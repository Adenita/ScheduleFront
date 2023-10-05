import {Component, OnInit} from '@angular/core';
import {Department, DepartmentTransport} from "../../shared/models/department";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {DepartmentService} from "../../core/http/department.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-departments-list',
  templateUrl: './departments-list.component.html',
  styleUrls: ['./departments-list.component.css']
})
export class DepartmentsListComponent implements OnInit {
  departments$: BehaviorSubject<Department[]>;
  departmentForm: FormGroup;
  showForm: boolean = false;
  editing: boolean = false;
  scheduleToBeEditedId: number = 0;

  constructor(
    private departmentService: DepartmentService,
    private formBuilder: FormBuilder
  ) {
    this.departmentForm = this.buildFormGroup(formBuilder);
    this.departments$ = new BehaviorSubject<Department[]>([]);
  }

  buildFormGroup(formBuilder: FormBuilder): FormGroup{
    return formBuilder.group({
      name: new FormControl('', Validators.required),
    })
  }

  ngOnInit() {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAll().subscribe({
      next: (departmentTransport: DepartmentTransport) => {
        this.departments$.next(departmentTransport.departments);
      },
      error: (err) => console.error('Error loading departments', err)
    })
  }

  postDepartment(){
    if (this.departmentForm.valid) {
      this.departmentService.post(this.departmentForm.value).subscribe({
        next: () => {
          this.loadDepartments();
          this.closeForm();
        },
        error: (err) =>  console.error('Error posting department:', err)
      })
    }
  }

  deleteDepartment(departmentId: number) {
    this.departmentService.delete(departmentId).subscribe({
      next: () => {
        this.loadDepartments();
      }
    })
  }

  toEdit(departmentId: number) {
    this.editing = true;
    this.openForm();
    this.scheduleToBeEditedId = departmentId;
  }

  updateDepartment(departmentId: number) {
    if (this.departmentForm.valid) {
      this.departmentService.update(departmentId, this.departmentForm.value).subscribe({
        next: () => {
          this.loadDepartments();
          this.closeForm();
          this.editing = false;
        },
        error: (err) =>  console.error('Error posting department:', err)
      })

    }
  }

  openForm() {
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
  }
}
