import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';
import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';

import 'hammerjs';


@Component({
    selector: 'points-component',
    templateUrl: 'points.component.html',
    styleUrls: ['points.component.css']
})


export class PointsComponent extends FluxComponent {

	selectedPoint: MapLocation = null;

  points: Array<MapLocation> = null;
  selectedIndex: number = 0;

  totalPoints: number = null;
  carouselRotation: number = 0;
  carouselTranslation: number = 0;
  carouselAngle: number = 0;

  transformProperty: any = '';

  currentView: string;
  showSummary: boolean = false;
  showDetail: boolean = false;
  showRoute: boolean = false;

	_loading = false;
    
    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
    	super(_d);
   	}

    protected onNextCard(event: any): void {
      var newSelectedIndex = (this.selectedIndex + 1) % this.totalPoints;
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.points[newSelectedIndex].id });
    }

    protected onPreviousCard(event: any): void {
      var newSelectedIndex = ((this.selectedIndex - 1) + this.totalPoints) % this.totalPoints;
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.points[newSelectedIndex].id });
    }

    protected onShowSummary(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'summary');
    }

    protected onShowDetail(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'detail');
    }

    protected onShowRoute(): void {
        this._d.dispatchAction(BasicActions.SET_VIEW, 'route');
        this._d.dispatchAction(BasicActions.SHOW_ROUTE, null);
    }

    protected onClickClose(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, '');
    }

    protected getTransformation(index){
      return this._sanitizer.bypassSecurityTrustStyle('rotateY( ' + (index * this.carouselRotation) + 'deg ) translateZ( ' + this.carouselTranslation + 'px )');
    }

    // update the component based on a new state of the global store
     protected __onModelUpdate(data: Object): void {
       switch (data['action'])
       {
           case BasicActions.SET_VIEW:
            this.currentView = data['currentView'];
            this.showSummary = this.currentView == 'summary';
            this.showDetail = this.currentView == 'detail';
            this.showRoute = this.currentView == 'route';
            this._chgDetector.detectChanges();
            break;

          case BasicActions.GET_MAP_POINTS:
            //this.points = data['mapElements'].slice(0, 9); 
            //this.totalPoints = 9;
            this.points = data['mapElements']; 
            this.totalPoints = data['mapElements'].length;
            this.carouselRotation = 360 / this.totalPoints;
            this.carouselTranslation = Math.round( ( 210 / 2 ) / Math.tan( Math.PI / this.totalPoints ) );
            console.log('totalPoints: ' + this.totalPoints);
            console.log('carouselRotation: ' + this.carouselRotation);
            console.log('carouselTranslation: ' + this.carouselTranslation);
            setTimeout(() => {
                  this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.points[0].id });
              }, 1000
            );
            this._loading = true;
            this._chgDetector.detectChanges();
            break;

          case BasicActions.GET_RANDOM_POINT:
          case BasicActions.SHOW_POINT:
            this.selectedPoint = <MapLocation> data['selectedPoint'];
            console.log(this.selectedPoint);
            for (var i = this.points.length - 1; i >= 0; i--) {
              if(this.points[i].id == this.selectedPoint.id ){
                if(Math.abs(this.selectedIndex - i) == 1 || ((this.selectedIndex + i) == this.totalPoints -1) ){
                  // estamos pasando los puntos con el dedo
                  var onForwardDirection = this.isNext(this.selectedIndex, i);
                  if(onForwardDirection){
                    this.carouselAngle += this.carouselRotation * -1;
                  }else{
                    this.carouselAngle += this.carouselRotation;
                  }
                }else{
                  // se seleccionó un punto en el mapa
                  this.carouselAngle = - (this.carouselRotation * i);
                }

                this.selectedIndex = i;

                console.log('carouselAngle: ' + this.carouselAngle);
                this.transformProperty = this._sanitizer.bypassSecurityTrustStyle('translateZ( -' + this.carouselTranslation + 'px ) rotateY(' + this.carouselAngle + 'deg )');
              }
            }
       }
     }

    private isNext(index: number, indexToCheck: number): boolean {
      if(indexToCheck == 0){
        return index == (this.totalPoints - 1);
      }
      if(indexToCheck == (this.totalPoints - 1)){
        return index != 0;
      }
      if(indexToCheck > index) {
        return true;
      }
      return false;
    }

}

