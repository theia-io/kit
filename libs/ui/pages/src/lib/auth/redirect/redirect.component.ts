import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import * as Realm from 'realm-web';

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'kit-page-redirect',
  templateUrl: './redirect.component.html',
})
export class RedirectComponent implements OnInit {
  ngOnInit() {
    Realm.handleAuthRedirect();
  }
}
