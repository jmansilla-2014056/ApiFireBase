import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire';

import {RouterModule, Routes} from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { RegistroComponent } from './components/registro/registro.component';
import {FormsModule} from '@angular/forms';
import { ReporteComponent } from './components/reporte/reporte.component';

import { DatePipe } from '@angular/common';
import { CoachComponent } from './components/coach/coach.component';


const rutas: Routes = [
  {
    path: 'registro',
    component: RegistroComponent
  },
  {
    path: 'reporte',
    component: ReporteComponent
  },
  {
    path: 'coach',
    component: CoachComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    RegistroComponent,
    ReporteComponent,
    CoachComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    RouterModule.forRoot(rutas),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
