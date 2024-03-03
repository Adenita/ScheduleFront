import { Directive, ElementRef, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Directive({
  standalone: true,
  selector: '[appCustomRouterLinkActive]',
})
export class CustomRouterLinkActiveDirective implements OnInit {
  constructor(
    private el: ElementRef,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const currentUrl = this.router.url;

        if (currentUrl !== '/' && currentUrl.includes('departments') && !currentUrl.includes('schedules')) {
          this.el.nativeElement.classList.add('active-link');
        } else {
          this.el.nativeElement.classList.remove('active-link');
        }
      }
    });
  }
}
