import {Model} from './model';

export enum StructureHeatCoolMode {
    COOL = 'cool',
    HEAT = 'heat',
    AUTO = 'auto'
}

export enum FlairMode {
    MANUAL = 'manual',
    AUTO = 'auto'
}

export class Structure extends Model {
    public static type = 'structures'

    updatedAt: Date = new Date();
    createdAt: Date = new Date();
    isActive = false;
    home = false;

    structureHeatCoolMode: StructureHeatCoolMode = StructureHeatCoolMode.COOL;
    mode : FlairMode = FlairMode.AUTO;

    public fromJSON(data: any): Structure {
      this.name = data.attributes.name;
      this.createdAt = new Date(data.attributes['created-at']);
      this.updatedAt = new Date(data.attributes['updated-at']);

      this.isActive = data.attributes['is-active'];
      this.home = data.attributes.home;
      this.structureHeatCoolMode = data.attributes['structure-heat-cool-mode'];
      this.mode = data.attributes.mode;

      this.id = data.id;
      return this;
    }

    public isPrimaryHome(): boolean {
      return this.home;
    }
}
