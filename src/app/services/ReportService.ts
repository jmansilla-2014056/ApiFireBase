import { Injectable } from '@angular/core';
import {AngularFireDatabase, AngularFireList, snapshotChanges} from '@angular/fire/database';
import {Router} from '@angular/router';
import {User} from '../model/User';
import {map} from 'rxjs/operators';
import {Activo} from '../model/Activo';
import { DatePipe } from '@angular/common';
import {Registro} from '../model/Registro';
import {Entranamiento} from '../model/Entranamiento';
import {strict} from 'assert';
import {Recorrido} from '../model/Recorrido';

@Injectable({
  providedIn: 'root'
})


// tslint:disable-next-line:class-name
export class reportService{
  // cambiosRealTime
  public fallo: number;
  public cambiosRealTime: Array<Registro>;
  public cambiosTop10: Array<Registro>;
  public reportEntramiento: Array<Entranamiento>;
  public saveKeys: Array<string>;
  // La variable activo contiene siempre el usuario activo, su pulsacion, oxigino y tiempo
  public activo: Activo = {  envio: '', fecha: '', user: ''};
  public datepipe: DatePipe = new DatePipe('en-US');
  public fechayhoraInicio: string;

  constructor(private db: AngularFireDatabase) {
    const fecha = new Date();
    const date = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    const timeString = this.datepipe.transform(fecha, 'hh-mm');
    this.fechayhoraInicio = date + '-' + timeString;
  }

  async sincronizar(): Promise<void> {
    console.log('wait');
    await this.delay(1000);
  }
  // metodo que trae un arreglo de todos los registros del usuario, el reporte se basa en la fecha que se ingrese
  // tslint:disable-next-line:typedef
  async get_AllDataUser(fecha: string, user: string, limite: number){
    if (fecha == null){
      this.datepipe = new DatePipe('en-US');
      const date = new Date();
      fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
      // console.log('entre:' + fecha);
    }
    if (user === null){
      user = this.activo.user;
    }
    if (limite === null){
      limite = 0;
    }
    this.cambiosRealTime = [];
    return new Promise((resolve, reject) => {
      this.db.database.ref('reportes/' + user + '/' + fecha).limitToLast(limite).on('value', (snapshot) => {
        const temp = snapshot.val();
        resolve(snapshot.val());
        const StringJson = JSON.stringify(temp);
        const ObjectJson = JSON.parse(StringJson);
        for (const key in ObjectJson){
          if (ObjectJson.hasOwnProperty(key)) {
          const nuevoRegistro = {} as Registro;
          nuevoRegistro.horaexacta = key;
          nuevoRegistro.cadena = ObjectJson[key];
          this.cambiosRealTime.push(nuevoRegistro);
        }
        }
      });
    });
  }

  // tslint:disable-next-line:typedef
  async get_AllDataEntranamiento(fecha: string, user: string){
    if (fecha == null){
      this.datepipe = new DatePipe('en-US');
      const date = new Date();
      fecha = this.datepipe.transform(date, 'yyyy-MM-dd');
      console.log('entre:' + fecha);
    }
    if (user === null){
      user = this.activo.user;
    }
    this.reportEntramiento = [];
    this.saveKeys = [];

    return new Promise((resolve, reject) => {
      this.db.database.ref('reportes2/' + user + '/' + fecha).on('value', (snapshot) => {
        const temp = snapshot.val();
        resolve(snapshot.val());
        const StringJson = JSON.stringify(temp);
        const ObjectJson = JSON.parse(StringJson);
        for (const key in ObjectJson) {
          if (ObjectJson.hasOwnProperty(key)) {
            const nuevoEntamiento = {} as Entranamiento;
            nuevoEntamiento.fechahora = key;
            nuevoEntamiento.recorridos = [];
            const HijoJson = JSON.parse(JSON.stringify(ObjectJson[key]));
            try {
              for (let i = 0; i < Object.keys(HijoJson).length + 1; i++){
                const nuevoRecorrido = {} as Recorrido;
                nuevoRecorrido.registros = [];
                nuevoRecorrido.numeroRecorrido = Number(Object.keys(HijoJson)[i]);
                const HijoJson2 = JSON.parse(JSON.stringify(HijoJson[Object.keys(HijoJson)[i]]));
                // tslint:disable-next-line:forin
                for (const key2 in HijoJson2){
                  const nuevoRegistro2 = {} as Registro;
                  if (HijoJson2.hasOwnProperty(key2)) {
                    nuevoRegistro2.horaexacta = key2;
                    nuevoRegistro2.cadena = HijoJson2[key2];
                    nuevoRecorrido.registros.push(nuevoRegistro2);
                  }
                }
                nuevoEntamiento.recorridos.push(nuevoRecorrido);
              }
            }catch (e) {
              console.log('Ocurrio un error');
            }
            this.reportEntramiento.push(nuevoEntamiento);
          }
        }
      });
    });
  }


  // Para llamar este metodo se debe primero invocar getAllUserData
  // tslint:disable-next-line:typedef
  async getTop10User(){
      this.cambiosTop10 = this.cambiosRealTime.slice(Math.max(this.cambiosRealTime.length - 10, 0));
  }

  //

  // Get_Cambio cambia todo el tiempo la variable activo de tipo Activo
  // tslint:disable-next-line:typedef
  async get_Cambio(){
    return new Promise((resolve, reject) => {
      this.db.database.ref('activo/').on('value', (snapshot) => {
        const u = snapshot.val();
        resolve(snapshot.val());
        const StringJson = JSON.stringify(u);
        const ObjcetJson = JSON.parse(StringJson);
        if (ObjcetJson.fecha !== this.activo.fecha){
          this.activo = ObjcetJson;
          this.activo.user = this.activo.user.replace('"', '').replace('"', '').replace(' ', '');
          this.activo.envio = this.activo.envio.replace('"', '').replace('"', '').replace(' ', '');
          this.insertOnReport(this.activo);
          this.insertOnRecorrido(this.activo);
        }
        try {
          this.getTop10User();
        }catch (e){
          console.log('Error sacando el top 10');
        }
      });
    });
  }

  async insertOnReport(newActivo: Activo): Promise<void>{
    this.datepipe = new DatePipe('en-US');
    const fecha = new Date();
    const dateString = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    console.log('datastring' +  dateString);
    const timeString = this.datepipe.transform(fecha, 'hh-mm-ss');
    console.log('timestring' + timeString);

    // Cambios
    const temp_envio = newActivo.envio;
    newActivo.envio = '{' + newActivo.envio + '}';
    newActivo.envio = newActivo.envio.replace('P', '"P"').replace('S', '"S"').replace('V', '"V"').replace('T', '"T"')
      .replace('B', '"B"').replace('M', '"M"');
    try{
      const ObjJson = JSON.parse(newActivo.envio);
      const a = ObjJson['V'];
      const b = ObjJson['P'];
      const c = ObjJson['S'];
      const d = ObjJson['B'];
      const e = ObjJson['M'];
      const f = ObjJson['T'];
      this.db.database.ref('reportes/' + newActivo.user + '/' + dateString).update({
        [timeString]: temp_envio
      });
    }catch (e){
      console.log('Datos basura CADENA INVALIDA');
    }
  }

  async insertOnRecorrido(newActivo: Activo): Promise<void>{
    this.datepipe = new DatePipe('en-US');
    const fecha = new Date();
    const dateString = this.datepipe.transform(fecha, 'yyyy-MM-dd');
    console.log('datastring' +  dateString);
    const timeString = this.datepipe.transform(fecha, 'hh-mm');
    console.log('timestring' + timeString);
    // tslint:disable-next-line:variable-name
    const temp_envio = newActivo.envio;
    newActivo.envio = '{' + newActivo.envio + '}';
    newActivo.envio = newActivo.envio.replace('P', '"P"').replace('S', '"S"').replace('V', '"V"').replace('T', '"T"')
      .replace('B', '"B"').replace('M', '"M"');
    let recorrido = '0';
    try{
      const ObjJson = JSON.parse(newActivo.envio);
      recorrido = ObjJson['V'];
      if (typeof recorrido !== undefined && typeof  recorrido !== 'undefined' && typeof recorrido != null && recorrido !== '0'){
        this.db.database.ref('reportes2/' + newActivo.user + '/' + dateString + '/' + this.fechayhoraInicio + '/' + '+' + recorrido).update(
          {
          [timeString]: temp_envio
        });
      }
    }catch (e) {
      console.log('Se encontro un dato basura');
    }
  }

  // tslint:disable-next-line:typedef
  async delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
