import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';
import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';

import 'hammerjs';


@Component({
    selector: 'summary-component',
    templateUrl: 'summary.component.html',
    styleUrls: ['summary.component.css']
})


export class SummaryComponent extends FluxComponent {

	selectedPoint: MapLocation = null;
	selectedPointBackgroundImage = null;
	selectedPointClass = null;

  elements: Array<MapLocation> = null;
  selectedIndex: number = 0;

  totalElements: number = null;
  carouselRotation: number = 0;
  carouselTranslation: number = 0;
  carouselAngle: number = 0;

  transformProperty: any = '';

  currentView: string;
  showSummary: boolean = false;
  showDetail: boolean = false;

	_loading = false;
    
    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
    	super(_d);
   	}

    // update the component based on a new state of the global store
   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.SET_VIEW:
            this.currentView = data['currentView'];
            this.showSummary = this.currentView == 'summary';
	        	this.showDetail = this.currentView == 'detail';
            console.log(this.showDetail);
	   			  this._chgDetector.detectChanges();
       			break;

          case BasicActions.GET_MAP_POINTS:
            //this.elements = data['mapElements'].slice(0, 9); 
            //this.totalElements = 9;
            this.elements = data['mapElements']; 
            this.totalElements = data['mapElements'].length;
            this.carouselRotation = 360 / this.totalElements;
            this.carouselTranslation = Math.round( ( 210 / 2 ) / Math.tan( Math.PI / this.totalElements ) );
            console.log('totalElements: ' + this.totalElements);
            console.log('carouselRotation: ' + this.carouselRotation);
            console.log('carouselTranslation: ' + this.carouselTranslation);
            setTimeout(() => {
                  this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.elements[0].id });
              }, 1000
            );
            this._loading = true;
            this._chgDetector.detectChanges();
            break;

          case BasicActions.GET_RANDOM_POINT:
          case BasicActions.SHOW_POINT:
            var selectedPoint: MapLocation = <MapLocation> data['selectedPoint'];
            console.log(selectedPoint);
            for (var i = this.elements.length - 1; i >= 0; i--) {
              let marker = this.elements[i];
              if(this.elements[i].id == selectedPoint.id ){
                console.log('selectedIndex: ' + this.selectedIndex);
                console.log('index: ' + i);
                var selectedOnCarousel: boolean = false;
                if(Math.abs(this.selectedIndex - i) == 1 || ((this.selectedIndex + i) == this.totalElements -1) ){
                  console.log('estamos pasando con el dedo');
                  selectedOnCarousel = true;
                }
                if(selectedOnCarousel){
                  var onForwardDirection = this.isNext(this.selectedIndex, i);
                  if(onForwardDirection){
                    console.log('hacia adelante');
                    this.carouselAngle += this.carouselRotation * -1;
                  }else{
                    console.log('hacia atrás');
                    this.carouselAngle += this.carouselRotation;
                  }
                }else{
                  this.carouselAngle = - (this.carouselRotation * i);
                }

                this.selectedIndex = i;

                console.log('carouselAngle: ' + this.carouselAngle);
                this.transformProperty = this._sanitizer.bypassSecurityTrustStyle('translateZ( -' + this.carouselTranslation + 'px ) rotateY(' + this.carouselAngle + 'deg )');
              }
            }
     	}
   	}


   	protected __onNextPoint(): void {
        this._dispatcher.dispatchAction(BasicActions.GET_RANDOM_POINT, null);
    }

    protected __onShowMap(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'map');
    }

    protected __onShowSummary(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'summary');
    }

    protected __onShowDetail(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'detail');
    }

    protected __onShowRoute(): void {
      this._d.dispatchAction(BasicActions.SET_VIEW, 'route');
      this._d.dispatchAction(BasicActions.SHOW_ROUTE, null);
    }

    protected __onClickCloseDetail(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, '');
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

    protected getTransformation(index){
      return this._sanitizer.bypassSecurityTrustStyle('rotateY( ' + (index * this.carouselRotation) + 'deg ) translateZ( ' + this.carouselTranslation + 'px )');
    }

    protected __onNextCard(event: any): void {
      var newSelectedIndex = (this.selectedIndex + 1) % this.totalElements;
      console.log('newSelectedIndex: ' + newSelectedIndex);
      /*console.log(this.selectedIndex);
      this.carouselAngle += this.carouselRotation * -1;
      console.log('carouselAngle: ' + this.carouselAngle);
      this.transformProperty = this._sanitizer.bypassSecurityTrustStyle('translateZ( -' + this.carouselTranslation + 'px ) rotateY(' + this.carouselAngle + 'deg )');*/
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.elements[newSelectedIndex].id });
    }

    protected __onPreviousCard(event: any): void {
      var newSelectedIndex = ((this.selectedIndex - 1) + this.totalElements) % this.totalElements;
      console.log('newSelectedIndex: ' + newSelectedIndex);
      /*this.carouselAngle += this.carouselRotation;
      console.log('carouselAngle: ' + this.carouselAngle);
      this.transformProperty = this._sanitizer.bypassSecurityTrustStyle('translateZ( -' + this.carouselTranslation + 'px ) rotateY(' + this.carouselAngle + 'deg )');*/
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.elements[newSelectedIndex].id });
    }

    private isNext(index: number, indexToCheck: number): boolean {
      if(indexToCheck == 0){
        return index == (this.totalElements - 1);
      }
      if(indexToCheck == (this.totalElements - 1)){
        return index != 0;
      }
      if(indexToCheck > index) {
        return true;
      }
      return false;
    }

}

