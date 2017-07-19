import { Component, ChangeDetectorRef } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';

import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';

@Component({
    selector: 'actions-component',
    templateUrl: 'actions.component.html',
    styleUrls: ['actions.component.css']
})


export class ActionsComponent extends FluxComponent {

	public selectedPoint: MapLocation;
	public selectedPointClass: string;

    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef) {
    	super(_d);
    }

   	public __onClickMainAction(){
        this._d.dispatchAction(BasicActions.SET_VIEW, 'detail');
   	}

   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.GET_RANDOM_POINT:
       		case BasicActions.SHOW_POINT:
	        	this.selectedPoint = <MapLocation> data['selectedPoint'];
	        	this.selectedPointClass = this.getFolderByType(this.selectedPoint.type) + '-button';
	   			this._chgDetector.detectChanges();
       			break;
     	}
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