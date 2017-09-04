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

  showDetail = false;

	_loading = false;
    
    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef, private _sanitizer: DomSanitizer) {
    	super(_d);
   	}

    // update the component based on a new state of the global store
   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		/*case BasicActions.GET_RANDOM_POINT:
       		case BasicActions.SHOW_POINT:
	        	this.selectedPoint = <MapLocation> data['selectedPoint'];
	        	this.selectedPointBackgroundImage = 'assets/img/' + this.getFolderByType(this.selectedPoint.type) + '/' + this.selectedPoint.id + '.jpg';
	        	this.selectedPointClass = this.getFolderByType(this.selectedPoint.type);
	         	this._loading = true;
	   			  this._chgDetector.detectChanges();
       			break;*/

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
            this._loading = true;
            this._chgDetector.detectChanges();
            break;
     	}
   	}


   	protected __onNextPoint(): void {
        this._dispatcher.dispatchAction(BasicActions.GET_RANDOM_POINT, null);
    }

    protected __onShowMap(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'map');
    }

    protected __onShowDetail(): void {
        this._dispatcher.dispatchAction(BasicActions.SET_VIEW, 'detail');
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
      this.selectedIndex = (this.selectedIndex + 1) % this.totalElements;
      console.log(this.selectedIndex);
      this.carouselAngle += this.carouselRotation * -1;
      this.transformProperty = this._sanitizer.bypassSecurityTrustStyle('translateZ( -' + this.carouselTranslation + 'px ) rotateY(' + this.carouselAngle + 'deg )');
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.elements[this.selectedIndex].id });
    }

    protected __onPreviousCard(event: any): void {
      this.selectedIndex = ((this.selectedIndex - 1) + this.totalElements) % this.totalElements;
      console.log(this.selectedIndex);
      this.carouselAngle += this.carouselRotation;
      this.transformProperty = this._sanitizer.bypassSecurityTrustStyle('translateZ( -' + this.carouselTranslation + 'px ) rotateY(' + this.carouselAngle + 'deg )');
      this._d.dispatchAction(BasicActions.SHOW_POINT, { id: this.elements[this.selectedIndex].id });
    }

}

