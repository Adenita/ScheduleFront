import { Component, OnInit } from '@angular/core';
import { UserTransport } from '../../../../../../shared/models/user';
import { UserService } from '../../../../../../core/services/http/user.service';
import { BehaviorSubject } from 'rxjs';
import { AuthenticationManagerService } from '../../../../../../core/services/authentication-manager.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css'],
})
export class UserDetailsComponent implements OnInit {
  user: UserTransport = {} as UserTransport;
  constructor(
    private userService: UserService,
    private authenticationManagerService: AuthenticationManagerService,
  ) {}

  ngOnInit(): void {
    const user = this.authenticationManagerService.getUser();
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
