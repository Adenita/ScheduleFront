import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassroomManagementComponent } from './pages/classroom-management/classroom-management.component';

const routes: Routes = [{ path: '', component: ClassroomManagementComponent }];

@NgModule({
    declarations: [],
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ClassroomRoutingModule {}
