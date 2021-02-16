import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {AngularFireObject} from '@angular/fire/database/interfaces';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../../model/User';
import {userService} from '../../services/UserService';
import {reportService} from '../../services/ReportService';
import {DatePipe} from '@angular/common';
import {Activo} from '../../model/Activo';


@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.css']
})
export class ReporteComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private router: Router) { }

  usuarioActual: any;
  fecha: string;
  reportcotroller = new reportService(this.db);
  listaRegistroUsuario: any;
  listaTop10Usuario: any;

  ngOnInit(): void {
    this.get_Data();
    this.get_Data();
  }

  onKey(event): void{
    this.fecha = event.target.value;
    this.update();
  }

  update(): void{
    this.reportcotroller.get_Cambio();
    // si la caja donde se ingresa la fecha esta null se asume que es la fecha de hoy.
    this.reportcotroller.get_AllDataUser(this.fecha, null);
    this.usuarioActual = JSON.stringify(this.reportcotroller.activo as Activo);
    this.listaRegistroUsuario = JSON.stringify(this.reportcotroller.cambiosRealTime);
    this.listaTop10Usuario = JSON.stringify(this.reportcotroller.cambiosTop10);
    console.log('-----------Reporte-----------');
    console.log(this.reportcotroller.cambiosRealTime);
    console.log('-----------Top 10------------');
    console.log(this.reportcotroller.cambiosTop10);
    this.router.navigate(['/reporte']);
  }

  // funcion que actualiza en tiempo real
  // tslint:disable-next-line:typedef
  get_Data() {
    return new Promise((resolve, reject) => {
      this.db.database.ref('activo/').on('value', (snapshot) => {
        this.update();
      });
    });
  }


}
