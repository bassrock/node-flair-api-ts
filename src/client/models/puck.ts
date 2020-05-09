import {Model} from "./model";

export class Puck extends Model {
    public static type = 'pucks'

    irSetupEnabled?: boolean;
    temperatureOffsetOverrideC?: number;
    features?: any;
    bluetoothTxPowerMw: number = 0;
    locked: boolean = false;
    oauthAppAssignedAt?: Date;
    beaconIntervalMs: number = 0;
    irDownload: boolean = false;
    setpointBoundLow: number = 0;
    temperatureOffsetC?: number;
    isGateway: boolean = false;
    subGhzRadioTxPowerMw?: number;
    currentRssi: number = 0;
    puckDisplayColor: string = '';
    inactive: boolean = false;
    setpointBoundHigh: number = 0;
    demoMode: number = 0;
    displayNumber: string = '';
    currentTemperatureC: number = 0;
    humidityOffset?: any;
    reportingIntervalDs: number = 0;
    currentHumidity: number = 0;
    orientation: string = '';
    dropRate: number = 0;
    updatedAt: Date = new Date();
    createdAt: Date = new Date();

    constructor(data: any) {
        super();
        this.fromJSON(data);
    }


    private fromJSON(data: any) {
        this.irSetupEnabled = data.attributes['ir-setup-enabled'];
        this.temperatureOffsetOverrideC = data.attributes['temperature-offset-override-c'];
        this.features = data.attributes['features'];
        this.bluetoothTxPowerMw = data.attributes['bluetooth-tx-power-mw'];
        this.locked = data.attributes['locked'];
        this.oauthAppAssignedAt = data.attributes['oauth-app-assigned-at'] ? new Date(data.attributes['oauth-app-assigned-at']) : undefined;
        this.beaconIntervalMs = data.attributes['beacon-interval-ms'];
        this.irDownload = data.attributes['ir-download'];
        this.name = data.attributes['name'];
        this.setpointBoundLow = data.attributes['setpoint-bound-low'];
        this.setpointBoundHigh = data.attributes['setpoint-bound-high'];
        this.temperatureOffsetC = data.attributes['temperature-offset-c'];
        this.isGateway = data.attributes['is-gateway'];
        this.subGhzRadioTxPowerMw = data.attributes['sub-ghz-radio-tx-power-mw'];
        this.currentRssi = data.attributes['current-rssi'];
        this.puckDisplayColor = data.attributes['puck-display-color'];
        this.inactive = data.attributes['inactive'];
        this.demoMode = data.attributes['demo-mode'];
        this.displayNumber = data.attributes['display-number'];
        this.currentTemperatureC = data.attributes['current-temperature-c'];
        this.humidityOffset = data.attributes['humidity-offset'];
        this.reportingIntervalDs = data.attributes['reporting-interval-ds'];
        this.currentHumidity = data.attributes['current-humidity'];
        this.orientation = data.attributes['orientation'];
        this.dropRate = data.attributes['drop-rate'];
        this.createdAt = new Date(data.attributes['created-at']);
        this.updatedAt = new Date(data.attributes['updated-at']);
        this.id = data.id;
    }
}
