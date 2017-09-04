import { Component, Input, ChangeDetectorRef } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';
import { Route } from '../shared/model/route.model';
import { MapLocation } from '../shared/model/map-location.model';
import { MapLocationType } from '../shared/model/map-location-type.model';

@Component({
    selector: 'route-component',
    templateUrl: 'route.component.html',
    styleUrls: ['route.component.css']
})


export class RouteComponent extends FluxComponent {
	
	public route: Route = null;
    public selectedPointImage: string = null;

	_loading = false;

    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef) {
    	super(_d);
    }

   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.SET_ROUTE:
	        	this.route = <Route> data['route'];
                var selectedPoint = <MapLocation> data['selectedPoint'];
                this.selectedPointImage = 'assets/img/' + this.getFolderByType(selectedPoint.type) + '/' + selectedPoint.id + '.jpg';
                console.log(this.route);
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
