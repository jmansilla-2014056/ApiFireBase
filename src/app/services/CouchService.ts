import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {Router} from '@angular/router';
import {User} from '../model/User';
import {map} from 'rxjs/operators';
import {userService} from './UserService';

@Injectable({
  providedIn: 'root'
})


// tslint:disable-next-line:class-name
export class couchService{
  public users: Array<User>;
  public user: User;
  public controllerUser: userService;
  constructor(private db: AngularFireDatabase) {
      // @ts-ignore
    this.controllerUser = new userService(this.db);
  }

  async sincronizar(): Promise<void> {
    await this.delay(100000);
  }

  async enlazarEntranador(entrenador: string, entrenado: string): Promise<boolean> {
    // El nombre de usuario no debe exisitir en la base de datos
    await this.delay(1000);
    this.controllerUser.get_User(entrenador);
    const Entrenador = this.controllerUser.user;
    this.controllerUser.get_User(entrenado);
    const Entrenado = this.controllerUser.user;

    if (Entrenador.rol !== 'C') {
      console.log('Error: El usuario no es entrenador');
      return false;
    }

    // Si no se puede agregar siginifica que ya existe
  }

  // tslint:disable-next-line:typedef
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }



}

