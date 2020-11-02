import {Model} from './model';

export enum AlertType {
    SystemOffline = 'SystemOffline',
    TemperatureOutOfBounds = 'TemperatureOutOfBounds',
    ThermostatDisconnected = 'ThermostatDisconnected',
    FirmwareAvailable = 'FirmwareAvailable'
}

export enum TemperatureScale {
    Farenheit = 'F',
    Celcius = 'C',
}

export class User extends Model {
    public static type = 'users'


    public globalEmail = false;
    public reviewPrompted = false;
    public contractorValidated = false;
    public email = '';
    public betas: [] = [];
    public salesChannel: any;
    public alertEmails = false;
    public defaultTemperaturePreferenceC = 0;
    public firmwareEmails = false;
    public pushStructureAlertTypes: [AlertType?] = []
    public emailStructureAlertTypes: [AlertType?] = []
    public temperatureScale: TemperatureScale = TemperatureScale.Celcius;
    public updatedAt: Date = new Date();
    public globalPush = false;
    public reviewStars?: string;
    public createdAt: Date = new Date();
    public role = 'user';
    public notificationSettingsPrompted = false;

    public fromJSON(data: any) : User {
      this.globalEmail = data.attributes['global-email'];
      this.name = data.attributes.name;
      this.reviewPrompted = data.attributes['review-prompted'];
      this.contractorValidated = data.attributes['contractor-validated'];
      this.email = data.attributes.email;
      this.betas = data.attributes.betas;
      this.salesChannel = data.attributes['sales-channel'];
      this.alertEmails = data.attributes['alert-emails'];
      this.defaultTemperaturePreferenceC = data.attributes['default-temperature-preference-c'];
      this.firmwareEmails = data.attributes['firmware-emails'];
      this.id = data.id;
      this.pushStructureAlertTypes = data.attributes['push-structure-alert-types'];
      this.emailStructureAlertTypes = data.attributes['email-structure-alert-types'];
      this.temperatureScale = data.attributes['temperature-scale'];
      this.updatedAt = new Date(data.attributes['updated-at']);
      this.globalPush = data.attributes['global-push'];
      this.reviewStars = data.attributes['review-stars'];
      this.createdAt = new Date(data.attributes['created-at']);
      this.role = data.attributes.role;
      this.notificationSettingsPrompted = data.attributes['notification-settings-prompted'];

      return this;
    }
}
