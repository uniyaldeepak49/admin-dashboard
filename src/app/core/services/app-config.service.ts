import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppConfigService {
  readonly appName = 'Admin Dashboard';
  readonly version = '1.0.0';
}
