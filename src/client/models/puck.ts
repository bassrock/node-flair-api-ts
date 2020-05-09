import {Model} from "./model";

export class Puck extends Model {
    public static type = 'pucks'

    irSetupEnabled?: boolean;
    temperatureOffsetOverrideC: number = 0;
    features?: any;
    bluetoothTxPowerMw: number = 0;
    locked: boolean = false;
    oauthAppAssignedAt?: Date;
    beaconIntervalMs: number = 0;
    irDownload: boolean = false;
    setpointBoundLow: number = 0;
    temperatureOffsetC: number = 0;
    isGateway: boolean = false;
    subGhzRadioTxPowerMw: number = 0;
    currentRssi: number = 0;
    puckDisplayColor: string = '';
    inactive: boolean = false;
    setpointBoundHigh: number = 0;
    demoMode: number = 0;
    displayNumber: string = '';
    currentTemperatureC: number = 0;
    humidityOffset: number = 0;
    reportingIntervalDs: number = 0;
    currentHumidity: number = 0;
    orientation: string = '';
    dropRate: number = 0;
    updatedAt: Date = new Date();
    createdAt: Date = new Date();

    desiredTemperatureC: number = 0;
    firmwareVersionB: string = '';
    firmwareVersionS: string = '';
    rssi: number = 0;
    firmwareVersionW: string = '';
    currentRoomPressure: number = 0;
    systemVoltage: number = 0;

    constructor(data: any) {
        super();
        this.fromJSON(data);
    }

    public setCurrentReading(data: any) {
        // {
        //       'room-temperature-c': 22.32,
        //       'firmware-version-s': 135,
        //       'current-offset': -500,
        //       'die-temperature': 3777,
        //       rssi: -56,
        //       'created-at': '2020-05-09T18:29:31.658576+00:00',
        //       'system-voltage': 3.41,
        //       light: 515,
        //       'button-pushes': 0,
        //       'firmware-version-b': 1,
        //       'is-gateway': true,
        //       'desired-temperature-c': 21.12,
        //       'firmware-version-w': 126,
        //       temperature: 2732,
        //       humidity: 44,
        //       'rotary-encoded-clicks': 0,
        //       'room-pressure': 100.62975,
        //       'message-version': 0
        //     },
        this.systemVoltage = data.attributes['system-voltage']
        this.currentTemperatureC = data.attributes['room-temperature-c']
        this.currentHumidity = data.attributes['humidity']
        this.firmwareVersionS = data.attributes['firmware-version-s']
        this.firmwareVersionB = data.attributes['firmware-version-b']
        this.firmwareVersionW = data.attributes['firmware-version-w']
        this.currentRoomPressure = data.attributes['room-pressure']
        this.rssi = data.attributes['rssi']
        this.desiredTemperatureC = data.attributes['desired-temperature-c']
        this.isGateway = data.attributes['is-gateway']
    }

    private fromJSON(data: any) {
        this.irSetupEnabled = data.attributes['ir-setup-enabled'];
        this.temperatureOffsetOverrideC = data.attributes['temperature-offset-override-c'] ? data.attributes['temperature-offset-override-c'] : 0;
        this.features = data.attributes['features'];
        this.bluetoothTxPowerMw = data.attributes['bluetooth-tx-power-mw'];
        this.locked = data.attributes['locked'];
        this.oauthAppAssignedAt = data.attributes['oauth-app-assigned-at'] ? new Date(data.attributes['oauth-app-assigned-at']) : undefined;
        this.beaconIntervalMs = data.attributes['beacon-interval-ms'];
        this.irDownload = data.attributes['ir-download'];
        this.name = data.attributes['name'];
        this.setpointBoundLow = data.attributes['setpoint-bound-low'];
        this.setpointBoundHigh = data.attributes['setpoint-bound-high'];
        this.temperatureOffsetC = data.attributes['temperature-offset-c'] ? data.attributes['temperature-offset-c'] : 0;
        this.isGateway = data.attributes['is-gateway'];
        this.subGhzRadioTxPowerMw = data.attributes['sub-ghz-radio-tx-power-mw'] ? data.attributes['sub-ghz-radio-tx-power-mw'] : 0;
        this.currentRssi = data.attributes['current-rssi'];
        this.puckDisplayColor = data.attributes['puck-display-color'];
        this.inactive = data.attributes['inactive'];
        this.demoMode = data.attributes['demo-mode'];
        this.displayNumber = data.attributes['display-number'];
        this.currentTemperatureC = data.attributes['current-temperature-c'];
        this.humidityOffset = data.attributes['humidity-offset'] ? data.attributes['humidity-offset'] : 0;
        this.reportingIntervalDs = data.attributes['reporting-interval-ds'];
        this.currentHumidity = data.attributes['current-humidity'];
        this.orientation = data.attributes['orientation'];
        this.dropRate = data.attributes['drop-rate'];
        this.createdAt = new Date(data.attributes['created-at']);
        this.updatedAt = new Date(data.attributes['updated-at']);
        this.id = data.id;
    }
}
