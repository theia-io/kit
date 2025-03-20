import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'kit-page-redirect-auth0',
  templateUrl: './redirect-auth0.component.html',
  imports: [],
})
export class PageRedirectAuth0Component implements OnInit {
  ngOnInit() {
    console.log('AUTH0 REDIRECT');
  }
}
