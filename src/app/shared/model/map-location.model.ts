import { MapLocationType } from './map-location-type.model';

export class MapLocation 
{

  // public properties
  public id: string;           // an optional string identifier that may be associated with this location
  public isError: boolean;     // flag an error associated with attempting to set this location
  public info: string;         // supplemental information associated with an error condition or other setting of this location

  // internal
  protected _lat: number;      // latitude of this location in degrees (in range -90 to 90, south of equator is negative)
  protected _long: number;     // longitude of this location in degrees (in range -180 t0 180, west of prime meridian is negative)
  protected _type: MapLocationType; 
  protected _name: string; 
  protected _description: string; 
  

  constructor()
  {
    this.clear();
  }

  public get latitude(): number
  {
    return this._lat;
  }

  public get longitude(): number
  {
    return this._long;
  }

  public get type(): MapLocationType
  {
    return this._type;
  }

  public get name(): string
  {
    return this._name;
  }

  public get description(): string
  {
    return this._description;
  }

  public set latitude(value: number)
  {
    if (!isNaN(value) && isFinite(value) && value >= -90 && value <= 90)
      this._lat = value;
  }

  public set longitude(value: number)
  {
    if (!isNaN(value) && isFinite(value) && value >= -180 && value <= 180)
      this._long = value;
  }

  public set type(value: MapLocationType)
  {
    this._type = value;
  }

  public set name(value: string)
  {
    this._name = value;
  }

  public set description(value: string)
  {
    this._description = value;
  }

  public clear(): void
  {
    this.id       = "";
    this.info     = "";
    this.isError  = false;
    this._lat     = 0;
    this._long    = 0;

    this._type = MapLocationType.NONE;
    this._name = "";
    this._description = "";
  }


  public clone(): MapLocation
  {
    let mapLocation: MapLocation = new MapLocation();

    mapLocation.id        = this.id;
    mapLocation.isError   = this.isError;
    mapLocation.info      = this.info;
    mapLocation.latitude  = this.latitude;
    mapLocation.longitude = this.longitude;
    mapLocation.type   = this._type;
    mapLocation.name   = this._name;
    mapLocation.description   = this._description;

    return mapLocation;
  }

}