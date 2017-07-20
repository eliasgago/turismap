import { Component, Input, ChangeDetectorRef } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';
import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';

@Component({
    selector: 'detail-component',
    templateUrl: 'detail.component.html',
    styleUrls: ['detail.component.css']
})


export class DetailComponent extends FluxComponent {
	
	selectedPoint: MapLocation = null;
	selectedPointClass: string;

	_loading = false;
    _showDetail = false;
    _fullView = false;
    
    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef) {
    	super(_d);
    }


    public __onClickOnDetail(){
        this._showDetail = !this._showDetail;
        if(this._showDetail){
            this._d.dispatchAction(BasicActions.SET_VIEW, 'detail');
            this._fullView = true;
        }else{
            this._d.dispatchAction(BasicActions.SET_VIEW, '');
            setTimeout(() => {
                this._fullView = false;
            }, 1000);
        }
    }


   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.GET_RANDOM_POINT:
       		case BasicActions.SHOW_POINT:
	        	this.selectedPoint = <MapLocation> data['selectedPoint'];
	        	this.selectedPointClass = this.getFolderByType(this.selectedPoint.type);
	   			this._loading = true;
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
