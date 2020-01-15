import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, Injectable, isDevMode } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ToastyModule } from 'ng2-toasty';
import { VehicleService } from "./services/VehicleService";
import * as Sentry from '@sentry/browser';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { VehicleFormComponent } from './vehicle-form/vehicle-form.component';
import { AppErrorHandler } from './app.error-handler';
import { VehicleListComponent } from './vehicle-list/vehicle-list.component';
import { PaginationComponent } from './shared/pagination.component';

Sentry.init({
  dsn: "https://0df0c7e86716463891cfe42dffb9130b@sentry.io/1878365"
});

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    CounterComponent,
    FetchDataComponent,
    VehicleFormComponent,
    VehicleListComponent,
    PaginationComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    ToastyModule.forRoot(),
    HttpModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'vehicles', pathMatch: 'full' },
      { path: 'counter', component: CounterComponent },
      { path: 'fetch-data', component: FetchDataComponent },
      { path: 'vehicles/new', component: VehicleFormComponent },
      { path: 'vehicles/:id', component: VehicleFormComponent },
      { path: 'vehicles', component: VehicleListComponent }
    ])
  ],
  providers: [
    VehicleService,
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
