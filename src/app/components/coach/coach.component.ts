import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {AngularFireObject} from '@angular/fire/database/interfaces';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../../model/User';
import {userService} from '../../services/UserService';
import {reportService} from '../../services/ReportService';
import {coachService} from '../../services/CoachService';
import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-coach',
  templateUrl: './coach.component.html',
  styleUrls: ['./coach.component.css']
})
export class CoachComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private router: Router) {
    // this.realtimer = this.temp.toString();
  }

  coachcontroller = new coachService(this.db);
  reportecontroller = new reportService(this.db);
  public atletas: Array<string>;

  ngOnInit(): void {
  }

  ficharDeportista(): void{
      const entrenador = (document.getElementById('entrenador') as HTMLInputElement).value;
      const entrenado = (document.getElementById('entrenado') as HTMLInputElement).value;
      this.coachcontroller.ficharAtleta(entrenador, entrenado);
  }

  extraetfichajes(): void{
    const entrenador = (document.getElementById('entrenador') as HTMLInputElement).value;
    this.coachcontroller.extraerfichajes(entrenador);
    this.atletas = this.coachcontroller.atletas;
    console.log(this.atletas);
  }

  // tslint:disable-next-line:typedef
  async detalleUsuario(){
    const deportista =  (document.getElementById('lista') as HTMLInputElement).value;
    console.log(deportista);
    this.reportecontroller.get_AllDataUser(null, deportista);
    this.reportecontroller.getTop10User();
    this.reportecontroller.sincronizar();
    console.log('---------------------TODO----------------------');
    console.log(this.reportecontroller.cambiosRealTime);
    console.log('---------------------TOP 10----------------------');
    console.log(this.reportecontroller.cambiosTop10);
  }



}
