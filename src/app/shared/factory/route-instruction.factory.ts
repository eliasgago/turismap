import { Injectable     } from '@angular/core';

import { RouteInstruction } from '../model/route-instruction.model';

@Injectable()
export class RouteInstructionFactory
{

  constructor() {}

  public createRouteInstruction(
    direction: string,
    distance: string,
    road: string,
    text: string,
    time: string,
    type: string
  ): RouteInstruction
  {
    let routeInstruction: RouteInstruction = new RouteInstruction();
    routeInstruction.direction = direction;
    routeInstruction.distance = distance;
    routeInstruction.road = road;
    routeInstruction.text = text;
    routeInstruction.time = time;
    routeInstruction.type = type;
    return routeInstruction;
  }

}