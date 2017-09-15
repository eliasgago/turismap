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

	public searchText: string = '';
    public isSearching: boolean = false;
	public foundElements: Array<MapLocation> = [];

    public currentLocationChecked: boolean = false;

    public previousView: string;
    public currentView: string;

    constructor(private _d: FluxDispatcher, private _chgDetector: ChangeDetectorRef) {
    	super(_d);
    }

    public onSearchInputFocus(){
        this.isSearching = true;
        this.previousView = this.currentView;
        this._d.dispatchAction(BasicActions.SET_VIEW, 'searching');
    }

    public onSearchInputClose(){
        this.isSearching = false;
        this._d.dispatchAction(BasicActions.SET_VIEW, this.previousView);
        this.foundElements = [];
        this.searchText = "";
    }

    public onSearch(event: any) {
        if(event.srcElement.value == '') {
            this.closeSearch();
        }
    }

    public onKeyUpSearch(event: any) {
        if(this.searchText != ''){
            this._d.dispatchAction(BasicActions.SEARCH_POINT, this.searchText);
        }
    }

    public onClickElement(id: string) {
        this._d.dispatchAction(BasicActions.SET_VIEW, 'summary');
        this._d.dispatchAction(BasicActions.SHOW_POINT, { id: id });
        this.foundElements = [];
        this.isSearching = false;
        this.searchText = "";
    }

    public onCheckCurrentLocation(){
        this._d.dispatchAction(BasicActions.SHOW_CURRENT_LOCATION, null);
    }

    public onUncheckCurrentLocation(){
        this._d.dispatchAction(BasicActions.HIDE_CURRENT_LOCATION, null);
    }

    private closeSearch(){
        console.log('close');
        this.isSearching = false;
        this.foundElements = [];
        this.searchText = "";
    }

   	protected __onModelUpdate(data: Object): void {
     	switch (data['action'])
     	{
       		case BasicActions.SEARCH_POINT:
	        	this.foundElements = <Array<MapLocation>> data['foundElements'];
	   			this._chgDetector.detectChanges();
       			break;
            case BasicActions.SHOW_CURRENT_LOCATION:
                this.currentLocationChecked = true;
                break;
            case BasicActions.HIDE_CURRENT_LOCATION:
                this.currentLocationChecked = false;
                break;
            case BasicActions.SET_VIEW:
                this.currentView = data['currentView'];
                break;
     	}
   	}

}
