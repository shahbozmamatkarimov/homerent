import { Routes } from '@angular/router';
import { RentWindow } from './rent-window/rent-window';
import { App } from './app';
import { EmptyComponent } from './empty-component/empty-component';

export const routes: Routes = [
    { path: '', component: EmptyComponent },
    { path: ':id', component: RentWindow },
];
