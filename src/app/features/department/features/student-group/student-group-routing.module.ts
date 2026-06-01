import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentGroupManagementComponent } from './pages/student-group-management/student-group-management.component';

const routes: Routes = [
    {
        path: '',
        component: StudentGroupManagementComponent,
    },
];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class StudentGroupRoutingModule {}
