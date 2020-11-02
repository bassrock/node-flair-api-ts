import {Model} from './model';

export enum PuckInactive {
    NotSetup = 'NotSetup',
    Active = 'Active',
}

export enum OccupancyMode {
    FlairAuto = 'Flair Auto',
}

export enum RoomAwayMode {
    SmartAway = 'Smart Away',
}

export class Room extends Model {
    public static type = 'rooms'

    updatedAt: Date = new Date();
    createdAt: Date = new Date();
    holdUntil?: Date;
    pucksInactive: PuckInactive = PuckInactive.NotSetup
    active = false;
    currentTemperatureC?: number;
    humidityAwayMax = 0;
    tempAwayMaxC = 0;
    tempAwayMinC = 0;
    holdReason?: string;
    windows?: any;
    holdUntilScheduleEvent = false;
    airReturn = false;
    frozenPipePetProtect = false;
    setPointC = 0;
    humidityAwayMin = 0;
    level?: number;
    currentHumidity?: number;
    stateUpdatedAt?: Date;
    preheatPrecool = false;

    //Unknown
    roomType = '';
    setPointManual?: string;
    occupancyMode: OccupancyMode = OccupancyMode.FlairAuto;
    roomAwayMode: RoomAwayMode = RoomAwayMode.SmartAway;


    // public setCurrentReading(data: any) {
    //     this.systemVoltage = data.attributes['system-voltage']
    //     this.lights = data.attributes['lights']
    //     this.ductPressure = data.attributes['duct-pressure']
    //     this.ductTemperatureC = data.attributes['duct-temperature-c']
    //     this.firmwareVersionS = data.attributes['firmware-version-s']
    //     this.percentOpen = data.attributes['percent-open']
    //     this.rssi = data.attributes['rssi']
    //     this.motorRunTime = data.attributes['motor-run-time']
    // }

    public fromJSON(data: any): Room {
      this.name = data.attributes.name;
      this.createdAt = new Date(data.attributes['created-at']);
      this.updatedAt = new Date(data.attributes['updated-at']);
      this.pucksInactive = data.attributes['pucks-inactive'];
      this.holdUntil = data.attributes['hold-until'] ? new Date(data.attributes['hold-until']) : undefined;
      this.roomType = data.attributes['room-type'];
      this.setPointManual = data.attributes['set-point-manual'] ? data.attributes['set-point-manual'] : undefined;
      this.active = data.attributes.active;
      this.currentTemperatureC = data.attributes['current-temperature-c'] ? data.attributes['current-temperature-c'] : undefined;
      this.humidityAwayMax = data.attributes['humidity-away-max'];
      this.tempAwayMaxC = data.attributes['temp-away-max-c'];
      this.tempAwayMinC = data.attributes['temp-away-min-c'];
      this.holdReason = data.attributes['hold-reason'] ? data.attributes['hold-reason'] : undefined;
      this.windows = data.attributes.windows;
      this.holdUntilScheduleEvent = data.attributes['hold-until-schedule-event'];
      this.airReturn = data.attributes['air-return'];
      this.frozenPipePetProtect = data.attributes['frozen-pipe-pet-protect'];
      this.humidityAwayMin = data.attributes['humidity-away-min'];
      this.setPointC = data.attributes['set-point-c'];
      this.level = data.attributes.level ? data.attributes.level : undefined;
      this.currentHumidity = data.attributes['current-humidity'] ? data.attributes['current-humidity'] : undefined;
      this.stateUpdatedAt = data.attributes['state-updated-at'] ? new Date(data.attributes['state-updated-at']) : undefined;
      this.preheatPrecool = data.attributes['preheat-precool'];
      this.occupancyMode = data.attributes['occupancy-mode'];
      this.roomAwayMode = data.attributes['room-away-mode'];

      this.id = data.id;
      return this;
    }
}
