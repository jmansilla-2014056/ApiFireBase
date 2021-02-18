import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {Router} from '@angular/router';
import {User} from '../model/User';
import {map} from 'rxjs/operators';
import {userService} from './UserService';
import {Registro} from '../model/Registro';

@Injectable({
  providedIn: 'root'
})


// tslint:disable-next-line:class-name
export class coachService {
  public atletas: Array<string>;
  public user: User;
  public controllerUser: userService;

  constructor(private db: AngularFireDatabase) {
    // @ts-ignore
    this.controllerUser = new userService(this.db);
  }

  async sincronizar(): Promise<void> {
    await this.delay(100000);
  }

  async ficharAtleta(entrenador: string, entrenado: string): Promise<boolean> {
    // El nombre de usuario no debe exisitir en la base de datos
    await this.delay(1000);
    await this.controllerUser.get_User(entrenador);
    const Entrenador = this.controllerUser.user;
    await this.controllerUser.get_User(entrenado);
    const Entrenado = this.controllerUser.user;

    if (Entrenador === null || Entrenado === null) {
      console.log('Error usuario no encontrado');
      return false;
    }

    if (Entrenador.rol !== 'C') {
      console.log('Error: El usuario no es entrenador');
      return false;
    }

    this.db.database.ref('coach/' + Entrenador.key).push({
        [Entrenado.key]: Entrenador.key
      }
    );
    console.log('Se ficho al usuario correctamente');
    return true;
    // Si no se puede agregar siginifica que ya existe
  }

  // tslint:disable-next-line:typedef
  async extraerfichajes(entrenador: string){
      this.db.list('/coach/' + entrenador).snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            (Object.keys(c.payload.val()).toString())
          )
        )
      ).subscribe(data => {
        this.atletas = data as Array<string>;
      });
  }
  // tslint:disable-next-line:typedef
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }



}

