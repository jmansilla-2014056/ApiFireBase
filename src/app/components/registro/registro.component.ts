import {Component, Input, OnInit} from '@angular/core';
import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {AngularFireObject} from '@angular/fire/database/interfaces';
import {Observable} from 'rxjs';
import { map } from 'rxjs/operators';
import {Router} from '@angular/router';
import {User} from '../../model/User';
import {userService} from '../../services/UserService';
import {reportService} from '../../services/ReportService';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent implements OnInit {

  constructor(private db: AngularFireDatabase, private router: Router) {
    // this.realtimer = this.temp.toString();
  }

  usercontroller = new userService(this.db);
  reportcontroller = new reportService(this.db);
  temp = [];
  realtimer: string;
  realtimer2: string;
  cambios = [];
  dinamic: any;
  users: Array<User>;

  ngOnInit(): void {
    this.get_Data4User();
    this.usercontroller.get_User('');
    this.usercontroller.get_Users();
  }

  viewAnSpecifi(): void{
    this.usercontroller.get_User(( document.getElementById('key') as HTMLInputElement).value);
    this.usercontroller.sincronizar();
    console.log(this.usercontroller.user);
  }

  viewAllusers(): void{
    this.usercontroller.get_Users();
    this.usercontroller.sincronizar();
    console.log(this.usercontroller.users);
  }

  insertUser(): void {
    const user = {} as User;
    user.sexo = ( document.getElementById('sexo') as HTMLInputElement).value;
    user.peso = ( document.getElementById('peso') as HTMLInputElement).value;
    user.estarua = ( document.getElementById('estatura') as HTMLInputElement).value;
    user.edad = ( document.getElementById('edad') as HTMLInputElement).value;
    user.apellido = ( document.getElementById('apellido') as HTMLInputElement).value;
    user.password = ( document.getElementById('password') as HTMLInputElement).value;
    user.key = ( document.getElementById('key') as HTMLInputElement).value;
    user.nombre = ( document.getElementById('nombre') as HTMLInputElement).value;
    user.rol = ( document.getElementById('rol') as HTMLInputElement).value;
    console.log(user.rol);
    this.usercontroller.insertUser(user);
  }
  // tslint:disable-next-line:typedef
  get_Data4User(){
    return new Promise((resolve, reject) => {
      const tempUserId = ( document.getElementById('key') as HTMLInputElement).value;
      const tempFecha = ( document.getElementById('fecha') as HTMLInputElement).value;
      this.db.database.ref('reportes/' + tempUserId + '/').on('value', (snapshot) => {
          this.reportcontroller.get_AllDataUser(tempFecha.toString(), tempUserId.toString());
          this.realtimer = JSON.stringify(this.reportcontroller.cambiosRealTime);
          console.log(this.reportcontroller.cambiosRealTime);
      });
    });
  }

}
