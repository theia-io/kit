import { Injectable } from '@angular/core';
import { DataSourceService } from '@kitouch/shared-infra';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends DataSourceService {}
