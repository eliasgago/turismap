import { Component, ChangeDetectorRef } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';

import { MapLocation } from '../shared/model/map-location.model';

@Component({
    selector: 'header-component',
    templateUrl: 'header.component.html',
    styleUrls: ['header.component.css']
})


export class HeaderComponent extends FluxComponent {

	public searchClass: string;
	public searchText: string;
	public foundElements: Array<MapLocation> = [];

    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef) {
    	super(_d);
    }

    public focusSearch(): void {
    	console.log('search');
    	this.searchClass = 'searching';
    }


    public blurSearch(): void {
    	this.searchClass = '';
    }

    public search(event: any) {
    	console.log(event.target.value);
        this._d.dispatchAction(BasicActions.SEARCH_POINT, this.searchText);
    }

    public showPoint(id: string) {
    	console.log(id);
        this._d.dispatchAction(BasicActions.SHOW_POINT, { id: id });
        this.foundElements = [];
        this.searchText = "";
    }

   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.SEARCH_POINT:
	        	this.foundElements = <Array<MapLocation>> data['foundElements'];
	        	console.log(this.foundElements);
	   			this._chgDetector.detectChanges();
       			break;
     	}
   	}

}
