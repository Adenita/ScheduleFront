import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  // onSearch(event: any, filteredList: BehaviorSubject<any[]>, originalList: BehaviorSubject<any[]>) {
  //   const searchValue = event.target.value;
  //   filteredList.next(
  //     originalList.getValue().filter((professor) =>
  //       professor.name.toLowerCase().includes(searchValue.toLowerCase()),
  //     ),
  //   );
  // }

  onSearch(event: any, filteredList: BehaviorSubject<any[]>, originalList: any[]) {
    const searchValue = event.target.value;
    filteredList.next(originalList.filter((professor) => professor.name.toLowerCase().includes(searchValue.toLowerCase())));
  }
}
