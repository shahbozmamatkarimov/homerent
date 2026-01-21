import { APP_INITIALIZER, ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { GlobalService } from './global/global';

export const appConfig: ApplicationConfig = {
  providers: [
     {
      provide: APP_INITIALIZER,
      useFactory: (globalService: GlobalService) => () => globalService.getFormOptions(),
      deps: [GlobalService],
      multi: true
    },
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), provideClientHydration(withEventReplay())
  ]
};
