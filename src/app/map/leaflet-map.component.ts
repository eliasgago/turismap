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
 * LeafletMap - A simple leaflet map component
 *
 * @author Jim Armstrong (www.algorithmist.net)
 *
 * @version 1.0
 */

import { Component, EventEmitter, Output } from '@angular/core';

// base Flux component & dispatcher
import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

// actions
import { BasicActions } from '../shared/actions/basic-actions';

import * as L from 'leaflet';
import { Map } from 'leaflet';
import { Marker } from 'leaflet';
import { FeatureGroup } from 'leaflet';
import 'leaflet-routing-machine';

import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';
import { Route } from '../shared/model/route.model';
import { RouteInstruction } from '../shared/model/route-instruction.model';

import { RouteInstructionFactory } from '../shared/factory/route-instruction.factory';

@Component({
  selector: 'leaflet-map',

  templateUrl: 'leaflet-map.component.html',

  styleUrls: ['leaflet-map.component.css'] 
})

export class LeafletMap extends FluxComponent {

  protected _map: Map;           // leaflet map
  protected _layerPoints: FeatureGroup;
  protected _markers: Array<any> = [];

  protected currentLocation: Marker;

  // this variable is only for routing machine (error on TypeScript)
  private Leaflet: any = L;
  private _formatter: any;

  // Outputs
  @Output() layerAdded  : EventEmitter<any> = new EventEmitter();
  @Output() layerRemoved: EventEmitter<any> = new EventEmitter();

  constructor(private _d: FluxDispatcher, private _routeInstructionFactory: RouteInstructionFactory)
   {
    super(_d);

    this._formatter = new this.Leaflet.Routing.Formatter({});
   }


  public toLocation(lat: number, long: number): void
  {
    this._map.panTo( [lat, long]);
  }

  route = null;


  public __onClickMap(){
    console.log('click on map');
    this._d.dispatchAction(BasicActions.SET_VIEW, 'map');
  }


  // update the component based on a new state of the global store
  protected __onModelUpdate(data: Object): void {
    switch (data['action']) {
      case BasicActions.GET_MAP_PARAMS:
        this.initialize( data['mapParams'], data['tileData'] );
        this._d.dispatchAction(BasicActions.GET_MAP_POINTS, null);
        break;

      case BasicActions.GET_MAP_POINTS:
        for(var i = 0; i < data['mapElements'].length; i++){
          let mapLocation : MapLocation = <MapLocation> data['mapElements'][i];
          let marker = this.addMarker(mapLocation);
          this._markers.push(marker);
        }
        this._layerPoints = L.featureGroup(this._markers).addTo(this._map); 

        /*if(this.route){
          this._map.removeControl(this.route);   
        }
        this.route = this.Leaflet.Routing.control({
          waypoints: [
            L.latLng(42.46175290530536, -7.587263882160186),
            L.latLng(42.417710436936574, -7.600843906402588)
          ],
          language: 'en'
        });
        this.route.addTo(this._map);

        console.log(this.route);

        this.route.on('routeselected', (e) => {
          console.log(e);
        })


        console.log(this.route._container);*/

        break;

      case BasicActions.GET_RANDOM_POINT:
      case BasicActions.SHOW_POINT:
        var selectedPoint: MapLocation = <MapLocation> data['selectedPoint'];
        for (var i = this._markers.length - 1; i >= 0; i--) {
          let marker = this._markers[i];
          if(marker.options.markerId == selectedPoint.id ){
            this.bindSelectedIcon(marker);
            marker.setOpacity(1);  
          }else{
            this.bindIcon(marker);
            marker.setOpacity(0.8);
          }
        }
        this._map.invalidateSize();

        this.showOnMap(selectedPoint);
        
        /*this._map.panTo(
          [selectedPoint.latitude, selectedPoint.longitude],
          {
            animate: true,
            duration: 1,
            easeLinearity: 0.6
          }
        );*/


        // this._map.fitBounds(this._layerPoints.getBounds());
        break;
      case BasicActions.CHANGE_VISIBLE_TYPES:
        let visibleTypes = data['visibleTypes'];
        for (var i = this._markers.length - 1; i >= 0; i--) {
          let marker = this._markers[i];
          if(visibleTypes.indexOf(marker.options.type) > -1){
            this._map.addLayer(marker);
          }else{
            this._map.removeLayer(marker);
          }
        }
        break;
      case BasicActions.SET_VIEW:
        /*setTimeout(() => { 
          this._map.invalidateSize({
            animate: true,
            duration: 1,
            easeLinearity: 0.6
          });
        }, 1000);*/
        var selectedPoint: MapLocation = <MapLocation> data['selectedPoint'];

        this._map.invalidateSize();

        var view = data['currentView'];
        if(view == 'detail'){
          this.showOnMap(selectedPoint, 500);
        }else{
          this.showOnMap(selectedPoint);
          if(view == '' && this.route){
            this._map.removeControl(this.route);   
          }
        }
        
        break;
      case BasicActions.SHOW_CURRENT_LOCATION:
        let location: MapLocation = <MapLocation> data['location'];
        console.log(location);
        
        this.currentLocation = L.marker([location.latitude, location.longitude]).addTo(this._map);
        this.bindCurrentLocationIcon(this.currentLocation);

        this.showOnMap(location);

        /*this._map.panTo( 
          [location.latitude, location.longitude],
          {
            animate: true,
            duration: 1,
            easeLinearity: 0.6
          }
        );*/
        break;

      case BasicActions.HIDE_CURRENT_LOCATION:
        this._map.removeLayer(this.currentLocation)
        break;

      case BasicActions.SHOW_ROUTE:
        let newRoute: Route = <Route> data['route'];
        var selectedPoint: MapLocation = <MapLocation> data['selectedPoint'];
        
        if(this.route){
          this._map.removeControl(this.route);   
        }
        this.route = this.Leaflet.Routing.control({
          waypoints: [
            L.latLng(newRoute.waypoints[0].latitude, newRoute.waypoints[0].longitude),
            L.latLng(newRoute.waypoints[1].latitude, newRoute.waypoints[1].longitude)
          ],
          language: 'en',
          createMarker: function() { return null; },
          lineOptions: {
              styles: [{color: '#0078ff', opacity: 1, weight: 2}]
           }
        });
        this.route.addTo(this._map);

        console.log(this.route);

        this.route.on('routeselected', (e) => {
          console.log(e.route);
          let instructions: Array<RouteInstruction> = this.getRouteInstructions(e.route.instructions);
          this._d.dispatchAction(BasicActions.SET_ROUTE, {
            arrive: selectedPoint.name,
            totalDistance: this._formatter.formatDistance(e.route.summary.totalDistance),
            totalTime: this._formatter.formatTime(e.route.summary.totalTime),
            instructions: instructions
          });
        });

        break;
    }     

  }


  protected __onLayerAdded(): void {
    this.layerAdded.emit();
  }

  protected __onLayerRemoved(): void {
    this.layerRemoved.emit();
  }

  private initialize(params: Object, tileData: Object): void {
    this._map =  L.map('leaflet-map-component', params);

    //events
    this._map.on('layeradd'   , () => {this.__onLayerAdded()}   );
    this._map.on('layerremove', () => {this.__onLayerRemoved()} );

    // tile layer
    var backgroundMap = L.tileLayer(tileData['url'], {
      attribution: tileData['attribution'],
      accessToken: tileData['accessToken']
    }).addTo(this._map); 

    // backgroundMap.setOpacity(0.4); 

    /*var routeControl = L.Control.extend({
        onAdd: (map) => {
          var dataDiv: any = L.DomUtil.create('div', 'data');

          var routeADiv: any = L.DomUtil.create('a', 'map-button', dataDiv);
          var routeImg: any = L.DomUtil.create('img', 'image', routeADiv);
          routeImg.src = 'assets/img/car.png';
          routeImg.width = '20';

          var locationADiv: any = L.DomUtil.create('a', 'map-button', dataDiv);
          var locationImg: any = L.DomUtil.create('img', 'image', locationADiv);
          locationImg.src = 'assets/img/current_location.png';
          locationImg.width = '20';

          L.DomEvent.on(routeADiv, 'click', () => {
            this._d.dispatchAction(BasicActions.SET_VIEW, 'route');
            this._d.dispatchAction(BasicActions.SHOW_ROUTE, null);
            //console.log(this);
          }, this)

          L.DomEvent.on(locationADiv, 'click', () => {
            this._d.dispatchAction(BasicActions.SHOW_CURRENT_LOCATION, null);
            //console.log(this);
          }, this)

          return dataDiv;
        },

        onRemove: function(map) {
            // Nothing to do here
        }
    });

    var routeControlFunction = function(opts) {
        return new routeControl(opts);
    }

    routeControlFunction({ position: 'topright' }).addTo(this._map);


    var optionsControl = L.Control.extend({
        onAdd: (map) => {
          var dataDiv: any = L.DomUtil.create('div', 'data');

          var maximizeADiv: any = L.DomUtil.create('a', 'map-button reverse maximize', dataDiv);
          var maximizeImg: any = L.DomUtil.create('img', 'image', maximizeADiv);
          maximizeImg.src = 'assets/img/maximize.png';
          maximizeImg.width = '20';

          var minimizeADiv: any = L.DomUtil.create('a', 'map-button reverse minimize', dataDiv);
          var minimizeImg: any = L.DomUtil.create('img', 'image', minimizeADiv);
          minimizeImg.src = 'assets/img/minimize.png';
          minimizeImg.width = '20';

          L.DomEvent.on(maximizeADiv, 'click', () => {
            this._d.dispatchAction(BasicActions.SET_VIEW, 'map');
            //console.log(this);
          }, this)

          L.DomEvent.on(minimizeADiv, 'click', () => {
            this._d.dispatchAction(BasicActions.SET_VIEW, 'summary');
            //console.log(this);
          }, this)

          return dataDiv;
        },

        onRemove: function(map) {
            // Nothing to do here
        }
    });

    var optionsControlFunction = function(opts) {
        return new optionsControl(opts);
    }

    optionsControlFunction({ position: 'topleft' }).addTo(this._map);*/
  }

  private addMarker(mapLocation: MapLocation) {
    var options = {
        markerId: mapLocation.id,
        type: mapLocation.type
    };
    var marker: Marker = L.marker([mapLocation.latitude, mapLocation.longitude], options);
    marker.on('click', (e) => {
      var marker = e.target;
      var markerId = marker.options.markerId;
      var type = marker.options.type;
      console.log('seleccionado: ' + markerId);
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: markerId });
    });
    this.bindIcon(marker);
    marker.setOpacity(0.8);
    return marker;
  }

  private getType(type): string {
    switch (type) {
      case MapLocationType.VIEWPOINT:
        return 'viewpoint';
      case MapLocationType.SITE:
        return 'site';
      case MapLocationType.LODGING:
        return 'lodging';
      case MapLocationType.WINERY:
        return 'winery';
      default:
        return '';
    }
  }

  private bindIcon(marker): void {
    var icon = L.divIcon({
      html: '<div class="icon_point ' + this.getType(marker.options.type) + '"></div>'
    });

    marker.setIcon(icon);

    //$(marker._icon).addClass(marker.options.type);
  }

  private bindSelectedIcon(marker): void {
    var iconSelected = L.divIcon({
      html: '<div class="pin ' + this.getType(marker.options.type) + '"></div><div class="pulse"></div>'
    });

    /*var iconSelected = L.icon({
        iconUrl: 'assets/img/marker.png',
        iconSize: [22, 35],
        iconAnchor: [20, 40]
    });*/

    marker.setIcon(iconSelected); 

    // marker.setIcon(icon);

    //$(marker._icon).addClass(marker.options.type);
  }

  private bindCurrentLocationIcon(marker): void {
    var iconSelected = L.divIcon({
      html: '<div class="current-location"></div>'
    });

    marker.setIcon(iconSelected); 
  }

  private getRouteInstructions(instructions: Array<any>): Array<RouteInstruction> {
    let routeInstructions: Array<RouteInstruction> = []
    for (var i = 0; i < instructions.length; i++) {
      let instruction = instructions[i];
      routeInstructions.push(this._routeInstructionFactory.createRouteInstruction(
        instruction.direction,
        this._formatter.formatDistance(instruction.distance),
        instruction.road,
        instruction.text,
        this._formatter.formatTime(instruction.time),
        this._formatter.getIconName(instruction, i)
      ));
    }
    return routeInstructions;
  }

  private showOnMap(selectedPoint: MapLocation, offset: number = -300){
    var targetPoint = this._map.project([selectedPoint.latitude, selectedPoint.longitude], this._map.getZoom()).subtract([0, offset / 2]),
    targetLatLng = this._map.unproject(targetPoint, this._map.getZoom());

    this._map.setView(targetLatLng, this._map.getZoom(), {
      animate: true,
      duration: 1,
      easeLinearity: 0.6
    });
  }


 }