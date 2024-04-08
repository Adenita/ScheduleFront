import { Component, OnInit } from '@angular/core';
import { UserTransport } from '../../../../../../shared/models/user';
import { UserService } from '../../../../../../core/services/http/user.service';
import { StorageService } from '../../../../../../core/services/storage.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss'],
})
export class UserDetailsComponent implements OnInit {
  user: UserTransport = {} as UserTransport;
  constructor(
    private userService: UserService,
    private storageService: StorageService,
  ) {}

  ngOnInit(): void {
    const user = this.storageService.getUser();
    if (user) {
      this.getUser(user.username);
    }
  }

  getUser(username: string) {
    this.userService
      .getUserByUsername(username)
      .pipe()
      .subscribe({
        next: (userTransport: UserTransport) => {
          this.user = userTransport;
        },
      });
  }
}
