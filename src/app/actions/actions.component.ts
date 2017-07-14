import { Component } from '@angular/core';

import { FluxComponent } from '../shared/flux/flux.component';
import { FluxDispatcher } from '../shared/flux/flux.dispatcher';

import { BasicActions } from '../shared/actions/basic-actions';

import { MapLocationType } from '../shared/model/map-location-type.model';

@Component({
    selector: 'actions-component',
    templateUrl: 'actions.component.html',
    styleUrls: ['actions.component.css']
})


export class ActionsComponent extends FluxComponent {

    constructor(private _d: FluxDispatcher) {
    	super(_d);
    }

   	public __onClickMainAction(){
        this._d.dispatchAction(BasicActions.SET_VIEW, 'detail');
   	}

    
}
