import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {Router} from '@angular/router';
import {User} from '../model/User';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})


// tslint:disable-next-line:class-name
export class userService{
  public users: Array<User>;
  public user: User;
  constructor(private db: AngularFireDatabase) {
  }

  async sincronizar(): Promise<void> {
    await this.delay(100000);
  }

  async insertUser(newUser: User): Promise<boolean> {
    // El nombre de usuario no debe exisitir en la base de datos
    this.get_User(newUser.key);
    await this.delay(1000);
    if (this.user === null) {
      this.db.database.ref('users/' + newUser.key).set({
        apellido: newUser.apellido,
        edad: newUser.edad,
        estatura: newUser.estarua,
        nombre: newUser.nombre,
        password: newUser.password,
        peso: newUser.peso,
        sexo: newUser.sexo,
        rol: newUser.rol
      });
      if (newUser.rol === 'C'){
        this.db.database.ref('couch/' + newUser.key).update({
          user: newUser.key
        });
      }
      console.log('Se agrego el usuario');
      return true;
    } else {
      console.log('No se pudo agregar el usuario');
      return false;
    }
    // Si no se puede agregar siginifica que ya existe
  }

  // metodo que trae un arreglo de usuarios con todos los usuarios
  get_Users(): void{
    this.db.list('/users').snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() as User })
        )
      )
    ).subscribe(data => {
      this.users = data as Array<User>;
    });
  }
  // tslint:disable-next-line:typedef
  get_User(username: string){
    return new Promise((resolve, reject) => {
      this.db.database.ref('users/' + username).on('value', (snapshot) => {
        const u = snapshot.val();
        resolve(snapshot.val());
        const StringJson = JSON.stringify(u);
        this.user = JSON.parse(StringJson);
        if (this.user != null){
          this.user.key = username;
        }
      });
    });
  }

  // tslint:disable-next-line:typedef
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}

