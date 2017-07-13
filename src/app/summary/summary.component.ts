import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';
import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';


@Component({
    selector: 'summary-component',
    templateUrl: 'summary.component.html',
    styleUrls: ['summary.component.css']
})


export class SummaryComponent extends FluxComponent {

	selectedPoint: MapLocation = null;
	selectedPointBackgroundImage = null;
	selectedPointClass = null;

	_loading = false;
    
    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef, private sanitizer: DomSanitizer) {
    	super(_d);
   	}

    // update the component based on a new state of the global store
   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.GET_RANDOM_POINT:
       		case BasicActions.SHOW_POINT:
	        	this.selectedPoint = <MapLocation> data['selectedPoint'];
	        	this.selectedPointBackgroundImage = 'assets/img/' + this.getFolderByType(this.selectedPoint.type) + '/' + this.selectedPoint.id + '.jpg';
	        	this.selectedPointClass = this.getFolderByType(this.selectedPoint.type);
	         	console.log(this.selectedPoint);
	         	this._loading = true;
	   			this._chgDetector.detectChanges();
       			break;
     	}
   	}


   	protected __onNextPoint(): void {
        this._dispatcher.dispatchAction(BasicActions.GET_RANDOM_POINT, null);
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

