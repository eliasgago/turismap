/** 
 * Copyright 2016 Jim Armstrong (www.algorithmist.net)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * This is the root application module for the Leaflet application
 *
 * @author Jim Armstrong (www.algorithmist.net)
 * 
 * @version 1.0
 */

// platform imports
import { Component     } from '@angular/core';
import { Directive     } from '@angular/core';
import { NgModule      } from '@angular/core';
import { Pipe          } from '@angular/core';
import { FormsModule   } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpModule    } from '@angular/http';

// main application component and supporting components
import { AppComponent     } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { ActionsComponent } from './actions/actions.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { SummaryComponent } from './summary/summary.component';
import { DetailComponent } from './detail/detail.component';
import { LeafletMap       } from './map/leaflet-map.component';
import { LoadingComponent } from './loading/loading.component';
// old import { MapNavComponent  } from './navigator/navigator.component';
// old import { InfoComponent  } from './info/info.component';

import { IconSearch , IconMenu, IconMap } from 'angular-feather';

// the shared model and dispatcher modules
import { SharedModelModule      } from './sharedModel.module';
import { SharedDispatcherModule } from './sharedDispatcher.module';

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, WelcomeComponent, SummaryComponent, DetailComponent, LeafletMap, ActionsComponent, FooterComponent, LoadingComponent
  ],

  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    FormsModule,
    SharedModelModule.forRoot(),
    SharedDispatcherModule.forRoot(),
      IconSearch,
      IconMenu,
      IconMap
  ],

  bootstrap: [AppComponent]
})

export class AppModule { }
