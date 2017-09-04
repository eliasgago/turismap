
export class RouteInstruction 
{

  protected _direction: string;
  protected _distance: string;
  protected _road: string;
  protected _text: string;
  protected _time: string;
  protected _type: string; 
  

  constructor()
  {
    this.clear();
  }

  public get direction(): string
  {
    return this._direction;
  }

  public get distance(): string
  {
    return this._distance;
  }

  public get road(): string
  {
    return this._road;
  }

  public get text(): string
  {
    return this._text;
  }

  public get time(): string
  {
    return this._time;
  }

  public get type(): string
  {
    return this._type;
  }

  public set direction(value: string)
  {
    this._direction = value;
  }

  public set distance(value: string)
  {
    this._distance = value;
  }

  public set road(value: string)
  {
    this._road = value;
  }

  public set text(value: string)
  {
    this._text = value;
  }

  public set time(value: string)
  {
    this._time = value;
  }

  public set type(value: string)
  {
    this._type = value;
  }

  public clear(): void
  {
    this._direction = "";
    this._distance = "";
    this._road = "";
    this._text = "";
    this._time = "";
    this._type = "";
  }

  public clone(): RouteInstruction
  {
    let routeInstruction: RouteInstruction = new RouteInstruction();

    routeInstruction.distance  = this._distance;
    routeInstruction.direction = this._direction;
    routeInstruction.road   = this._road;
    routeInstruction.text   = this._text;
    routeInstruction.time   = this._time;
    routeInstruction.type   = this._type;

    return routeInstruction;
  }

}