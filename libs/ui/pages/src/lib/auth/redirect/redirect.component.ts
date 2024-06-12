import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import * as Realm from 'realm-web';

@Component({
  standalone: true,
  selector: 'kit-page-redirect',
  templateUrl: './redirect.component.html',
  imports: [CommonModule],
})
export class PageRedirectComponent implements OnInit {
  ngOnInit() {
    Realm.handleAuthRedirect();
  }
}
