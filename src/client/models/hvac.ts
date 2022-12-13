import {Model} from "./model";
import {Room} from "./room";
import exp from "constants";

export enum TemperatureScale {
    F = 'F',
    C = 'C'
}

export enum HVACPowerMode {
    ON = 'On',
    OFF = 'Off'
}

export enum HVACSwingMode {
    ON = 'On',
    OFF = 'Off'
}

export enum HVACMode {
    AUTO = 'Auto',
    FAN = 'Fan',
    HEAT = 'Heat',
    COOL = 'Cool',
    DRY = 'Dry'
}

export enum HVACFanSpeed {
    AUTO = 'Auto',
    LOW = 'Low',
    MEDIUM = 'Medium',
    HIGH = 'High'
}

export class HVAC extends Model {
    public static type = 'hvac'

    room?: Room;

    temperature: number = 0;
    temperatureScale: TemperatureScale = TemperatureScale.F;
    home: boolean = false;
    power: HVACPowerMode = HVACPowerMode.OFF;
    modelId: string = "";
    irDeviceModelId: string = "";
    makeName: string = "";
    swing: HVACSwingMode = HVACSwingMode.OFF;
    mode: HVACMode = HVACMode.AUTO;
    fanSpeed: HVACFanSpeed = HVACFanSpeed.AUTO;
    roomId: string = "";
    
    public fromJSON(data: any): HVAC {
        this.name = data.attributes['name'];
        this.temperature = data.attributes['temperature'];
        this.power = data.attributes['power'];
        this.modelId = data.attributes['model-id'];
        this.irDeviceModelId = data.attributes['model-id'];
        this.makeName = data.attributes['make-name'];
        this.swing = data.attributes['swing'];
        this.mode = data.attributes['mode'];
        this.fanSpeed = data.attributes['fan-speed'];
        this.temperatureScale = data.attributes.constraints['temperature-scale'];
        this.id = data.id;
        this.roomId = data.relationships.room.data['id'];


        return this;
    }

    public setRoom(room: Room) {
        this.room = room;
    }

    public getSetPointC(temperature?: number): number {
        // return set point in C no matter what the HVAC units are
        // uses the internal state if nothing passed in
        const tempToCalculate = (temperature ? temperature : this.temperature);
        if (this.temperatureScale === TemperatureScale.F) {
            return ((tempToCalculate  - 32) * 5) / 9;
        } else {
            return tempToCalculate;
        }
    }

    public convertFromCToSetPointUnits(temperature: number): number {
        // return the correct set point relative to hardware units given a temp in C
        if (this.temperatureScale === TemperatureScale.F) {
            return Math.round((temperature * (9/5)) + 32);
        } else {
            return temperature;
        }
    }

}
