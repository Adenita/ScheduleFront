import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScheduleListComponent } from './components/schedule-list/schedule-list.component';
@NgModule({
    declarations: [ScheduleListComponent],
    imports: [CommonModule, FormsModule],
    exports: [RouterModule, ScheduleListComponent],
})
export class FeatureSharedModule {}
