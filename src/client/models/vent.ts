import {Model} from "./model";

export class Vent extends Model {
    public static type = 'vents'

    inactive: boolean = false;
    setupLightstrip: number = 1;
    percentOpen: number = 0;
    percentOpenReason: string = '';
    hasBuzzed: boolean = false;
    updatedAt: Date = new Date();
    createdAt: Date = new Date();
    firmwareVersionS: string = '';
    ductPressure: number = 0;
    ductTemperatureC: number = 0;
    rssi: number = 0;
    motorRunTime: number = 0;
    lights?: any;
    systemVoltage: number = 0;

    constructor(data: any) {
        super();
        this.fromJSON(data);
    }

    public setCurrentReading(data: any) {
        this.systemVoltage = data.attributes['system-voltage']
        this.lights = data.attributes['lights']
        this.ductPressure = data.attributes['duct-pressure']
        this.ductTemperatureC = data.attributes['duct-temperature-c']
        this.firmwareVersionS = data.attributes['firmware-version-s']
        this.percentOpen = data.attributes['percent-open']
        this.rssi = data.attributes['rssi']
        this.motorRunTime = data.attributes['motor-run-time']
    }

    public fromJSON(data: any) : Vent {
        this.name = data.attributes['name'];
        this.inactive = data.attributes['inactive'];
        this.setupLightstrip = data.attributes['setup-lightstrip'];
        this.percentOpen = data.attributes['percent-open'];
        this.percentOpenReason = data.attributes['percent-open-reason'];
        this.hasBuzzed = data.attributes['has-buzzed'];
        this.createdAt = new Date(data.attributes['created-at']);
        this.updatedAt = new Date(data.attributes['updated-at']);
        this.id = data.id;
        return this;
    }
}
