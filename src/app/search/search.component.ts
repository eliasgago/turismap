import { Component, ChangeDetectorRef } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';

import { MapLocation } from '../shared/model/map-location.model';

@Component({
    selector: 'search-component',
    templateUrl: 'search.component.html',
    styleUrls: ['search.component.css']
})


export class SearchComponent extends FluxComponent {

	public searchClass: string;
	public searchText: string;
    public searching: boolean = false;
	public foundElements: Array<MapLocation> = [];
    public locationActive: boolean = false;
    public currentView: string;

    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef) {
    	super(_d);
    }

    public focusSearch(): void {
    	console.log('search');
    	this.searchClass = 'searching';
        this._d.dispatchAction(BasicActions.SET_VIEW, 'searching');
    }


    public blurSearch(): void {
    	this.searchClass = '';
        this.searching = false;
        this._d.dispatchAction(BasicActions.SET_VIEW, 'summary');
    }

    public search(event: any) {
    	console.log(event.target.value);
        this.searching = true;
        this._d.dispatchAction(BasicActions.SEARCH_POINT, this.searchText);
    }

    public activateLocation(){
        this._d.dispatchAction(BasicActions.SHOW_CURRENT_LOCATION, null);
    }

    public deactivateLocation(){
        this._d.dispatchAction(BasicActions.HIDE_CURRENT_LOCATION, null);
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
            case BasicActions.SHOW_CURRENT_LOCATION:
                this.locationActive = true;
                break;
            case BasicActions.HIDE_CURRENT_LOCATION:
                this.locationActive = false;
                break;
            case BasicActions.SET_VIEW:
                this.currentView = data['currentView'];
                break;
     	}
   	}

}
