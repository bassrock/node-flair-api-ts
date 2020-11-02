import {Model} from './model';

export class Vent extends Model {
    public static type = 'vents'

    inactive = false;
    setupLightstrip = 1;
    percentOpen = 0;
    percentOpenReason = '';
    hasBuzzed = false;
    updatedAt: Date = new Date();
    createdAt: Date = new Date();
    firmwareVersionS = '';
    ductPressure = 0;
    ductTemperatureC = 0;
    rssi = 0;
    motorRunTime = 0;
    lights?: any;
    systemVoltage = 0;

    public setCurrentReading(data: any) {
      this.systemVoltage = data.attributes['system-voltage'];
      this.lights = data.attributes.lights;
      this.ductPressure = data.attributes['duct-pressure'];
      this.ductTemperatureC = data.attributes['duct-temperature-c'];
      this.firmwareVersionS = data.attributes['firmware-version-s'];
      this.percentOpen = data.attributes['percent-open'];
      this.rssi = data.attributes.rssi;
      this.motorRunTime = data.attributes['motor-run-time'];
    }

    public fromJSON(data: any) : Vent {
      this.name = data.attributes.name;
      this.inactive = data.attributes.inactive;
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
