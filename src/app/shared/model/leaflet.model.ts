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

/**
 * LeafletModel - This is the global store for the Leaflet example application.  Data placed into the store is derived from the Angular 2
 * Leaflet starter, https://github.com/haoliangyu/angular2-leaflet-starter
 *
 * The model is Redux-style in the sense that it maintains immutability, accepts action dispatch with type and payload,
 * internally reduces the model as needed, and then sends copies of relevant slices of the model to subscribers. 
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

 // platform imports
 import { Injectable } from '@angular/core';

 // interfaces
 import { IReduxModel } from '../interfaces/redux.model.interface';

 // actions
 import { BasicActions } from '../actions/basic-actions';

 // services - adding an actual service layer to the application is left as an exercise
 import { MapLocationService } from '../services/map-location.service';

 // typescript math toolkit
 import { TSMT$Location } from './location.model';
 import { MapLocation } from './map-location.model';
 import { MapLocationType } from './map-location-type.model';
 import { Route } from './route.model';
 import { RouteInstruction } from './route-instruction.model';

 // leaflet
 import * as L from 'leaflet';

 // rxjs
 import { Subject    } from 'rxjs/Subject';
 import { Observable } from 'rxjs/Observable';

 @Injectable()
 export class LeafletModel implements IReduxModel
 {
   // singleton instance; this is not necessary, but allows the model to be used outside the Angular DI system
   private static _instance: LeafletModel;

   // reference to actual store - this remains private to support compile-time immutability
   private _store: Object = new Object();

   // current action
   private _action: number;

   // has airport data been fetched?
   private _airportsFetched: boolean = false;

   // subscribers to model updates
   private _subscribers:Array<Subject<any>>;


   constructor(private _mapLocationService: MapLocationService) 
   {
     if (LeafletModel._instance instanceof LeafletModel) 
       return LeafletModel._instance;
     
     // define the structure of the global application store
     this._store['location'] = new TSMT$Location();

     this._store['visibleTypes'] = [MapLocationType.VIEWPOINT, MapLocationType.SITE, MapLocationType.LODGING];

     this._store['tileData'] = {
      url: "https://api.mapbox.com/styles/v1/eliasgago/cj6wdigx7091o2rp5dbs1niwe/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZWxpYXNnYWdvIiwiYSI6ImNqM3ZtbDlheTAwMG8zMW8wYzNocGVzcXcifQ.3Ex1pscNCyDO4Pdq3uIqLw",
      accessToken: 'pk.eyJ1IjoiZWxpYXNnYWdvIiwiYSI6ImNqM3ZtbDlheTAwMG8zMW8wYzNocGVzcXcifQ.3Ex1pscNCyDO4Pdq3uIqLw'
     };

     this._store['mapParams'] = {
       zoomControl: true
       , center: L.latLng(42.438862, -7.551178)
       , zoom: 12
       , minZoom: 4
       , maxZoom: 18
       , trackResize: false
     };

     this._store['mapElements'] = [];

     // list of subscribers for updates to the store
     this._subscribers = new Array<Subject<any>>();

     // current action
     this._action = BasicActions.NONE;

     // singleton instance
     LeafletModel._instance = this;
   }

  /**
   * Subscribe a new Subject to the model
   *
   * @param subject: Subject<any> A Subject with at least an 'next' handler
   *
   * @return Nothing - The Subject is added to the subscriber list
   */
   public subscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     console.log('suscribiendose al modelo');
     console.log(subject);
     if (subject)
       this._subscribers.push(subject);
   }

  /**
   * Unsubscribe an existing Subject from the model
   *
   * @param subject: Subject<any> Existing subscribed Subject
   *
   * @return Nothing - If found, the Subject is removed from the subscriber list (typically executed when a component is destructed)
   */
   public unsubscribe( subject: Subject<any> ): void
   {
     // for a full-on, production app, would want to make this test tighter
     if (subject)
     {
       let len: number = this._subscribers.length;
       let i: number;

       for (i=0; i<len; ++i)
       {
         if (this._subscribers[i] === subject)
         {
           this._subscribers.splice(i,1);
           break;
         }
       }
     }
   }

  /**
   * Dispatch an Action to the model, which causes the model to be changed - application of a reducer - and then a slice of the new model
   * is sent to all subscribers.  This includes the action that caused the reduction.  A copy of model data is always sent to perserve
   * immutability.
   *
   * @param action: number Action type
   *
   * @param payload: Object (optional) Payload for the action, which may be used by a reducer
   *
   * @return Nothing - All subscribers are notified after the model is updated
   */
   public dispatchAction(action: number, payload: any=null): void
   {
     let validAction: Boolean = false;
     let data:Object;

     this._action = action;
     switch (this._action)
     {
       case BasicActions.GET_MAP_PARAMS:
         // params are hardcoded at construction in this demo
         this._store['action'] = this._action;

         validAction = true; 
       break;

       case BasicActions.GET_MAP_POINTS:
         this._store['action'] = this._action;

         this._mapLocationService.getMapLocation()
          .subscribe( 
            data  => {
              this._store['mapElements'].push(data);
            },
            error => {
            },
            () => {
             this.__updateSubscribers();
            }
         );
         validAction = false; 
       break;

       case BasicActions.GET_RANDOM_POINT:
         this._store['action'] = this._action;

         this._mapLocationService.getRandomLocation(this._store['visibleTypes'])
          .subscribe( 
            data  => {
              this._store['selectedPoint'] = data;
            },
            error => {
            },
            () => {
             this.__updateSubscribers();
            }
         );
         validAction = false; 
       break;

       case BasicActions.SHOW_POINT:
         this._store['action'] = this._action;

         if (payload.hasOwnProperty('id')){
           let id = payload['id'];
           this._mapLocationService.getLocationById(id)
            .subscribe( 
              data  => {
                this._store['selectedPoint'] = data;
              },
              error => {
              },
              () => {
               this.__updateSubscribers();
              }
           );
           validAction = false; 
          }
         break;

       case BasicActions.CHANGE_VISIBLE_TYPES:
         this._store['action'] = this._action;

         if (payload.hasOwnProperty('types')){
           let visibleTypes = payload['types'];
           this._store['visibleTypes'] = visibleTypes;
           validAction = true; 
          }
         break;

       case BasicActions.SET_VIEW:
         this._store['action'] = this._action;

         this._store['currentView'] = payload;
         validAction = true; 
         break;


       case BasicActions.SHOW_CURRENT_LOCATION:
         // note that you could cache the current location (once fetched) and maintain that in the global store as well if you expect this path to be executed
         // many times.
         let location: TSMT$Location = <TSMT$Location> this._store['location'];

         this._store['action'] = this._action;
        
         this._mapLocationService.getCurrentLocation()
                              .subscribe( data  => this.__onCurrentLocation(data),
                                          error => this.__onLocationError() );

         validAction = false;    // wait until service data is completely processed before responding
       break;

       case BasicActions.HIDE_CURRENT_LOCATION:
         // note that you could cache the current location (once fetched) and maintain that in the global store as well if you expect this path to be executed
         // many times.
         this._store['action'] = this._action;
         this._store['location'] = null;
        
         validAction = true;    // wait until service data is completely processed before responding
       break;

       case BasicActions.SHOW_ROUTE:
         this._store['action'] = this._action;

         let destination: MapLocation = <MapLocation> this._store['selectedPoint'];
        
         this._mapLocationService.getCurrentLocation()
                              .subscribe( data  => this.__onPrepareRoute(data, destination),
                                          error => this.__onLocationError() );

         validAction = false;    // wait until service data is completely processed before responding
       break;
       
       case BasicActions.SET_ROUTE:
         this._store['action'] = this._action;

         let route: Route = this._store['route'];
         route.arrive = payload.arrive;
         route.totalDistance = payload.totalDistance;
         route.totalTime = payload.totalTime;
         route.instructions = <Array<RouteInstruction>> payload.instructions;
         console.log(this._store['route']);
        
         validAction = true;    // wait until service data is completely processed before responding
       break;


       case BasicActions.SEARCH_POINT:
         this._store['action'] = this._action;
         this._store['foundElements'] = [];
         
         var searchText: string = payload;
         this._mapLocationService.searchLocation(searchText)
          .subscribe( 
            data  => {
              console.log(data);
              this._store['foundElements'].push(data);
            },
            error => {
            },
            () => {
             this.__updateSubscribers();
            }
         );
         validAction = false; 
       break;

       case BasicActions.ALL:
         // to be implemented as an exercise
       break;
     }

     // immediately update all subscribers?
     if (validAction)
       this.__updateSubscribers();
   }

   private __updateSubscribers(): void
   {
     // send copy of the current store to subscribers, which includes most recent action - you could recopy for each subscriber or have the
     // subscribers make a copy of the required slice of the store.  Former is more robust, latter is more efficient.  Try it both ways;
     // the global store is immutable in either case.

     let location: MapLocation = <MapLocation> this._store['location'];
     let selectedPoint: MapLocation = <MapLocation> this._store['selectedPoint'];
     let route: Route = <Route> this._store['route'];
     let store: Object           = JSON.parse( JSON.stringify(this._store) );  // this isn't as robust as you may have been led to believe

     // this is the hack
     if(location)
       store['location'] = location.clone();  

     store['visibleTypes'] = this._store['visibleTypes'];  

     store['currentView'] = this._store['currentView'];  

     if(store['selectedPoint'])
       store['selectedPoint'] = selectedPoint.clone();                           

     for(var i = 0; i < this._store['mapElements'].length; i++){
       let mapLocation: MapLocation = <MapLocation> this._store['mapElements'][i];
       store['mapElements'][i] = mapLocation.clone();
     }

     if(this._store['foundElements']){
       for(var i = 0; i < this._store['foundElements'].length; i++){
         let mapLocation: MapLocation = <MapLocation> this._store['foundElements'][i];
         store['foundElements'][i] = mapLocation.clone();
       }
     }

     if(store['route'])
       store['route'] = route.clone();    

     this._subscribers.map( (s:Subject<any>) => s.next(store) );
   }

   // update the location in the global store and broacast to subscribers
   private __onCurrentLocation(data: any): void
   {
     if (data)
     {
       if (data instanceof MapLocation)
       {
         let location = (<MapLocation> data).clone();

         if (location.isError)
           this.__onAddressError();
         else
         {
           this._store['location'] = location;

           this.__updateSubscribers();
         }
       }
     }
   }

   private __onPrepareRoute(data: any, destination: MapLocation): void
   {
     if (data)
     {
       if (data instanceof MapLocation)
       {
         let origin = (<MapLocation> data).clone();

         if (origin.isError)
           this.__onAddressError();
         else
         {
           let route: Route = new Route();
           route.waypoints = [origin, destination];
           this._store['route'] = route;

           this.__updateSubscribers();
         }
       }
     }
   }

   // error handlers broken into separate methods to allow future flexibility to add customized handling based on error type; otherwise, these could
   // be folded into one method with the action as an argument
   private __onLocationError(): void
   {
     // for purposes of error information, we can 'fake' a global store as only the action is required for subsequent action
     this._subscribers.map( (s:Subject<any>) => s.next({'action': BasicActions.LOCATION_ERROR}) );
   }
   
   private __onAddressError(): void
   {
     this._subscribers.map( (s:Subject<any>) => s.next({'action': BasicActions.ADDRESS_ERROR}) );
   }
 }
