import { Component, OnInit } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';

import { MapLocationType } from '../shared/model/map-location-type.model';

@Component({
    selector: 'footer-component',
    templateUrl: 'footer.component.html',
    styleUrls: ['footer.component.css']
})


export class FooterComponent extends FluxComponent implements OnInit {

 	viewpointsCheck: boolean;
 	sitesCheck: boolean;
 	lodgingsCheck: boolean;
 	wineriesCheck: boolean;

    constructor(private _d: FluxDispatcher) {
    	super(_d);
    }

	public ngOnInit() {
     	this.viewpointsCheck = true;
     	this.sitesCheck = true;
     	this.lodgingsCheck = true;
     	this.wineriesCheck = false;
   	}

   	public __onUpdateCheck(){
        this._d.dispatchAction(BasicActions.CHANGE_VISIBLE_TYPES, this.getVisibleTypes());
   	}

   	private getVisibleTypes(){
   		var types: Array<MapLocationType> = [];
   		if(this.viewpointsCheck)
   			types.push(MapLocationType.VIEWPOINT);
   		if(this.sitesCheck)
   			types.push(MapLocationType.SITE);
   		if(this.lodgingsCheck)
   			types.push(MapLocationType.LODGING);
   		if(this.wineriesCheck)
   			types.push(MapLocationType.WINERY);
   		return {
   			types: types
   		};
   	}
    
}
