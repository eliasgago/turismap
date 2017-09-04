import { MapLocation } from './map-location.model';
import { RouteInstruction } from './route-instruction.model';

export class Route 
{

  protected _arrive: string;
  protected _totalDistance: string;
  protected _totalTime: string;
  protected _waypoints: Array<MapLocation>;
  protected _instructions: Array<RouteInstruction>;
  
  constructor()
  {
    this.clear();
  }

  public get arrive(): string
  {
    return this._arrive;
  }

  public get totalDistance(): string
  {
    return this._totalDistance;
  }

  public get totalTime(): string
  {
    return this._totalTime;
  }

  public get waypoints(): Array<MapLocation>
  {
    return this._waypoints;
  }

  public get instructions(): Array<RouteInstruction>
  {
    return this._instructions;
  }

  public set arrive(value: string)
  {
    this._arrive = value;
  }

  public set totalDistance(value: string)
  {
    this._totalDistance = value;
  }

  public set totalTime(value: string)
  {
    this._totalTime = value;
  }

  public set waypoints(value: Array<MapLocation>)
  {
    this._waypoints = value;
  }

  public set instructions(value: Array<RouteInstruction>)
  {
    this._instructions = value;
  }

  public clear(): void
  {
    this._arrive = "";
    this._totalDistance = "";
    this._totalTime = "";
    this._waypoints = [];
    this._instructions = [];
  }

  public clone(): Route
  {
    let route: Route = new Route();

    route.arrive = this._arrive;
    route.totalDistance = this._totalDistance;
    route.totalTime = this._totalTime;
    route.waypoints   = this._waypoints;
    route.instructions   = this._instructions;

    return route;
  }

}