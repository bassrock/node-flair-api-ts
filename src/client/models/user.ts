import {Model} from "./model";

export enum AlertType {
    SystemOffline = 'SystemOffline',
    TemperatureOutOfBounds = 'TemperatureOutOfBounds',
    ThermostatDisconnected = 'ThermostatDisconnected',
    FirmwareAvailable = 'FirmwareAvailable'
}

export class User extends Model {
    public static type = 'users'


    public globalEmail: boolean = false;
    public name: string = '';
    public reviewPrompted: boolean = false;
    public contractorValidated: boolean = false;
    public email: string = '';
    public betas: [] = [];
    public salesChannel: any;
    public alertEmails: boolean = false;
    public defaultTemperaturePreferenceC: number = 0;
    public firmwareEmails: boolean = false;
    public pushStructureAlertTypes: [AlertType?] = []
    public emailStructureAlertTypes: [AlertType?] = []

    constructor(data: any) {
        super();
        this.fromJSON(data);
    }


    private fromJSON(data: any) {
        this.globalEmail = data.attributes['global-email'];
        this.reviewPrompted = data.attributes['review-prompted'];
        this.contractorValidated = data.attributes['contractor-validated'];
        this.email = data.attributes['email'];
        this.betas = data.attributes['betas'];
        this.salesChannel = data.attributes['sales-channel'];
        this.alertEmails = data.attributes['alert-emails'];
        this.defaultTemperaturePreferenceC = data.attributes['default-temperature-preference-c'];
        this.firmwareEmails = data.attributes['firmware-emails'];
        this.id = data.id;
        this.pushStructureAlertTypes = data.attributes['push-structure-alert-types']
        this.emailStructureAlertTypes = data.attributes['email-structure-alert-types']
    }
}
