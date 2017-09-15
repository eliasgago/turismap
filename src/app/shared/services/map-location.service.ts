/** 
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// platform imports
import { Injectable     } from '@angular/core';
import { Http, Response } from '@angular/http';

// rxjs
import { Observable } from 'rxjs/Observable';
import * as Rx from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { MapLocation } from '../model/map-location.model';
import { MapLocationType } from '../model/map-location-type.model';

/**
 * A basic service to return current location based on IP address
 */

@Injectable()
export class MapLocationService 
{

  constructor(protected _http: Http) 
  {
    // empty
  }

  points = [
    {
        "id": "barca",
        "type": MapLocationType.VIEWPOINT,
        "name" : "A Barca",
        "lat": 42.4244108470418,
        "lon": -7.661574482917785
    },
    {
        "id": "chancis",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Os Chancís",
        "lat": 42.411231108946076,
        "lon": -7.634741663932801
    },
    {
        "id": "cividade",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro da Cividade",
        "lat": 42.39334215481423,
        "lon": -7.615011334419251
    },
    {
        "id": "boqueirino",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro do Boqueiriño",
        "lat": 42.40393908425197,
        "lon": -7.596171498298644
    },
    {
        "id": "santiorxo",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro de Santiorxo",
        "lat": 42.40786840656946,
        "lon": -7.568507194519042,
        "description": "En la parroquia de Santiorxo se encuentra el mirador que lleva su mismo nombre. Rodeado por un pinar nos deja entrever uno de los infinitos meandros que el Sil realiza hasta juntarse con el Miño. Acondicionado con un pequeño paseo de madera que nos lleva hasta él, durante ese trayecto tenemos varios bancos desde donde podemos comtemplar el río y los cañones que en este punto miden hasta 500m.",
        "tips": [
            "Es el mirador desde el cual podemos ver más longitud del río.",
            "El coche nos lleva hasta un pundo desde donde ya contemplamos los cañones.",
            "Merendar en uno de esos bancos es uno de los placeres de la Ribeira Sacra."
        ]
    },
    {
        "id": "cadeiras",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro de Cadeiras",
        "lat": 42.3976841411843,
        "lon": -7.555275857448577,
        "description": "En la parroquia de Santiorxo se encuentra el mirador que lleva su mismo nombre. Rodeado por un pinar nos deja entrever uno de los infinitos meandros que el Sil realiza hasta juntarse con el Miño. Acondicionado con un pequeño paseo de madera que nos lleva hasta él, durante ese trayecto tenemos varios bancos desde donde podemos comtemplar el río y los cañones que en este punto miden hasta 500m.",
        "tips": [
            "Es el mirador desde el cual podemos ver más longitud del río.",
            "El coche nos lleva hasta un pundo desde donde ya contemplamos los cañones.",
            "Merendar en uno de esos bancos es uno de los placeres de la Ribeira Sacra."
        ]
    },
    {
        "id": "chelos",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro de Os Chelos",
        "lat": 42.38953276520176,
        "lon": -7.517826855182647,
        "description": "En la parroquia de Santiorxo se encuentra el mirador que lleva su mismo nombre. Rodeado por un pinar nos deja entrever uno de los infinitos meandros que el Sil realiza hasta juntarse con el Miño. Acondicionado con un pequeño paseo de madera que nos lleva hasta él, durante ese trayecto tenemos varios bancos desde donde podemos comtemplar el río y los cañones que en este punto miden hasta 500m.",
        "tips": [
            "Es el mirador desde el cual podemos ver más longitud del río.",
            "El coche nos lleva hasta un pundo desde donde ya contemplamos los cañones.",
            "Merendar en uno de esos bancos es uno de los placeres de la Ribeira Sacra."
        ]
    },
    {
        "id": "souto_chao",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro de Souto Chao",
        "lat": 42.407500043057176,
        "lon": -7.471837699413299
    },
    {
        "id": "pena",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Miradoiro da Pena do Castelo",
        "lat": 42.412528216274005,
        "lon": -7.467776834964752
    },
    {
        "id": "siltrip",
        "type": MapLocationType.VIEWPOINT,
        "name" : "SilTrip",
        "lat": 42.409381446908135,
        "lon": -7.632086277008057
    },
    {
        "id": "catamaran",
        "type": MapLocationType.VIEWPOINT,
        "name" : "Catamarán",
        "lat": 42.4095794861362,
        "lon": -7.444020509719849
    },
    {
        "id": "turismo",
        "type": MapLocationType.SITE,
        "name" : "Oficina de Turismo",
        "icon": "./img/info_icon.png",
        "lat": 42.46204971576779,
        "lon": -7.587255835533141
    },
    {
        "id": "xabrega",
        "type": MapLocationType.SITE,
        "name" : "Os Muiños do Xabrega",
        "icon": "./img/xabrega_icon.png",
        "lat": 42.41889454494551,
        "lon": -7.630434036254883
    },
    {
        "id": "canabal",
        "type": MapLocationType.SITE,
        "name" : "Igrexa de San Pedro de Canabal",
        "icon": "./img/iglesia_icon.png",
        "lat": 42.48237788307621,
        "lon": -7.585777938365935
    },
    {
        "id": "proendos",
        "type": MapLocationType.SITE,
        "name" : "Petroglifos de Proendos",
        "icon": "./img/proendos_icon.png",
        "lat": 42.45169217735101,
        "lon": -7.583417594432831
    },
    {
        "id": "bolmente",
        "type": MapLocationType.SITE,
        "name" : "Igrexa de Santa María de Bolmente",
        "icon": "./img/iglesia_icon.png",
        "lat": 42.4224269349809,
        "lon": -7.589288949966431
    },
    {
        "id": "pinol",
        "type": MapLocationType.SITE,
        "name" : "Igrexa de San Vicente de Pinol",
        "icon": "./img/iglesia_icon.png",
        "lat": 42.405899815164204,
        "lon": -7.549495697021484,
        "description": "En la parroquia de Santiorxo se encuentra el mirador que lleva su mismo nombre. Rodeado por un pinar nos deja entrever uno de los infinitos meandros que el Sil realiza hasta juntarse con el Miño. Acondicionado con un pequeño paseo de madera que nos lleva hasta él, durante ese trayecto tenemos varios bancos desde donde podemos comtemplar el río y los cañones que en este punto miden hasta 500m.",
        "tips": [
            "Es el mirador desde el cual podemos ver más longitud del río.",
            "El coche nos lleva hasta un pundo desde donde ya contemplamos los cañones.",
            "Merendar en uno de esos bancos es uno de los placeres de la Ribeira Sacra."
        ]
    },
    {
        "id": "gundivos",
        "type": MapLocationType.SITE,
        "name" : "Centro Oleiro Rectoral de Gundivós",
        "icon": "./img/gundivos_icon.png",
        "lat": 42.446261403946686,
        "lon": -7.5407034158706665
    },
    {
        "id": "lobios",
        "type": MapLocationType.SITE,
        "name" : "Igrexa de San Xillao de Lobios",
        "icon": "./img/iglesia_icon.png",
        "lat": 42.40813774626316,
        "lon": -7.530913352966309,
        "description": "En la parroquia de Santiorxo se encuentra el mirador que lleva su mismo nombre. Rodeado por un pinar nos deja entrever uno de los infinitos meandros que el Sil realiza hasta juntarse con el Miño. Acondicionado con un pequeño paseo de madera que nos lleva hasta él, durante ese trayecto tenemos varios bancos desde donde podemos comtemplar el río y los cañones que en este punto miden hasta 500m.",
        "tips": [
            "Es el mirador desde el cual podemos ver más longitud del río.",
            "El coche nos lleva hasta un pundo desde donde ya contemplamos los cañones.",
            "Merendar en uno de esos bancos es uno de los placeres de la Ribeira Sacra."
        ]
    },
    {
        "id": "donatus",
        "type": MapLocationType.LODGING,
        "name" : "Vila Donatus",
        "lat": 42.41389658591989,
        "lon": -7.478824853897094
    },
    {
        "id": "corona",
        "type": MapLocationType.LODGING,
        "name" : "Casa Corona",
        "lat": 42.45853538959867,
        "lon": -7.597963213920593
    },
    {
        "id": "flores",
        "type": MapLocationType.LODGING,
        "name" : "Casa das Flores",
        "lat": 42.44503822748129,
        "lon": -7.573903799057006
    },
    {
        "id": "estevo",
        "type": MapLocationType.LODGING,
        "name" : "Casa do Estevo",
        "lat": 42.42134783469654,
        "lon": -7.472907900810241
    },
    {
        "id": "rio_sil",
        "type": MapLocationType.LODGING,
        "name" : "Apartamentos Río Sil",
        "lat": 42.4166946207761,
        "lon": -7.597289979457854
    },
    {
        "id": "madrina",
        "type": MapLocationType.LODGING,
        "name" : "Casa da Madriña",
        "lat": 42.48857888524799,
        "lon": -7.574032545089722
    },
    {
        "id": "anllo",
        "type": MapLocationType.LODGING,
        "name" : "Rectoral de Anllo",
        "lat": 42.43931391926548,
        "lon": -7.626260519027709
    },
    {
        "id": "rosende",
        "type": MapLocationType.LODGING,
        "name" : "Casa Grande de Rosende",
        "lat": 42.45652089523697,
        "lon": -7.620472311973571
    },
    {
        "id": "ruperto",
        "type": MapLocationType.LODGING,
        "name" : "Casa Ruperto",
        "lat": 42.414728286601516,
        "lon": -7.479715347290039
    },
    {
        "id": "solveira",
        "type": MapLocationType.LODGING,
        "name" : "Casa Solveira",
        "lat": 42.417710436936574,
        "lon": -7.600843906402588,
        "description": "En la parroquia de Santiorxo se encuentra el mirador que lleva su mismo nombre. Rodeado por un pinar nos deja entrever uno de los infinitos meandros que el Sil realiza hasta juntarse con el Miño. Acondicionado con un pequeño paseo de madera que nos lleva hasta él, durante ese trayecto tenemos varios bancos desde donde podemos comtemplar el río y los cañones que en este punto miden hasta 500m.",
        "tips": [
            "Es el mirador desde el cual podemos ver más longitud del río.",
            "El coche nos lleva hasta un pundo desde donde ya contemplamos los cañones.",
            "Merendar en uno de esos bancos es uno de los placeres de la Ribeira Sacra."
        ]
    }
  ];



  public getMapLocation(): Observable<MapLocation> {

    var result: Array<MapLocation> = [];

    for (var i = this.points.length - 1; i >= 0; i--) {
        var mapLocation: MapLocation = this.createMapLocation(this.points[i]);

        result.push(mapLocation);
    }    

    return Rx.Observable.from(result);


  }

  public getLocationById(id): Observable<MapLocation> {
    var mapLocation: MapLocation = null;
    var locationFound;

    for (var i = this.points.length - 1; i >= 0; i--) {
      if(this.points[i].id == id){
        locationFound = this.points[i];
        break;
      }
    }

    if(locationFound){
      mapLocation = this.createMapLocation(locationFound);
    }
    return Rx.Observable.of(mapLocation);
  }

  public getRandomLocation(visibleTypes: Array<MapLocationType>): Observable<MapLocation> {
    var mapLocation: MapLocation = null;

    //var newSelectedIndex = Math.floor((Math.random() * this.points.length));
    var testIndexes = [5, 6, 16, 18];
    var newSelectedIndex = Math.floor((Math.random() * testIndexes.length));;
    newSelectedIndex = testIndexes[newSelectedIndex];

    let found = false;
    while(!found){
        if(visibleTypes.indexOf(this.points[newSelectedIndex].type) > -1){
            mapLocation = this.createMapLocation(this.points[newSelectedIndex]);
            found = true;
        }else{
            newSelectedIndex = Math.floor((Math.random() * this.points.length));
        }
    }
    return Rx.Observable.of(mapLocation);
  }

  public searchLocation(searchText: string): Observable<MapLocation> {

    var result: Array<MapLocation> = [];

    for (var i = this.points.length - 1; i >= 0; i--) {
        if(this.points[i].name.toLowerCase().indexOf(searchText.toLowerCase()) != -1) {
            var mapLocation: MapLocation = this.createMapLocation(this.points[i]);

            result.push(mapLocation);
        }
    }    

    return Rx.Observable.from(result);
  }

  /*public searchOtherLocation(searchText: string): Observable<MapLocation> {
    let location: MapLocation = new MapLocation();

    return this._http
        .get("http://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(searchText) + '&components=country:ES&postalCode:27460')
        .map(res => res.json())
        .map(result => {
            if (result.status !== "OK")
            {
                console.log( "Error attempting to encode: ", searchText);
                location.name = searchText;
                location.isError = true;

                return location;
            } else {

                console.log(result);

                location.name            = result.results[0].formatted_address;
                location.latitude           = result.results[0].geometry.location.lat;
                location.longitude          = result.results[0].geometry.location.lng;

                return location;
            }
        }
    );
  }*/


  public getCurrentLocation(): Observable<MapLocation> {
    var mapLocation: MapLocation = new MapLocation();
    var locationFound;
    
    mapLocation.latitude = 42.46175290530536;
    mapLocation.longitude = -7.587263882160186;

    return Rx.Observable.of(mapLocation);
  }


  private createMapLocation(point): MapLocation {
      var mapLocation: MapLocation = new MapLocation();

      mapLocation.id = point.id;
      mapLocation.type = point.type;
      mapLocation.name = point.name;
      mapLocation.latitude = point.lat;
      mapLocation.longitude = point.lon;
      mapLocation.description = point.description;
      mapLocation.image = 'assets/img/' + this.getFolderByType(point.type) + '/' + point.id + '.jpg';
      mapLocation.tips = point.tips;

      return mapLocation;
  }

    private getFolderByType(type: MapLocationType) {
        switch (type) {
            case MapLocationType.VIEWPOINT:
                return 'viewpoint';    
            case MapLocationType.SITE:
                return 'site';    
            case MapLocationType.LODGING:
                return 'lodging';    
            case MapLocationType.WINERY:
                return 'winery';
        }
    }

}
