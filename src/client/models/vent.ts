import {Model} from "./model";

export class Vent extends Model {
    public static type = 'vents'

    name: string = '';
    inactive: boolean = false;
    setupLightstrip: number = 1;
    percentOpen: number = 0;
    percentOpenReason: string = '';
    hasBuzzed: boolean = false;
    updatedAt: Date = new Date();
    createdAt: Date = new Date();

    constructor(data: any) {
        super();
        this.fromJSON(data);
    }


    private fromJSON(data: any) {
        this.name = data.attributes['name'];
        this.inactive = data.attributes['inactive'];
        this.setupLightstrip = data.attributes['setup-lightstrip'];
        this.percentOpen = data.attributes['percent-open'];
        this.percentOpenReason = data.attributes['percent-open-reason'];
        this.hasBuzzed = data.attributes['has-buzzed'];
        this.createdAt = new Date(data.attributes['created-at']);
        this.updatedAt = new Date(data.attributes['updated-at']);
        this.id = data.id;
    }
}
