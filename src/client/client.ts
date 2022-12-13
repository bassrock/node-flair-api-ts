import axios, {AxiosInstance} from "axios";
import * as querystring from 'query-string';
import moment, {Moment} from 'moment';
import {FlairMode, Puck, Structure, StructureHeatCoolMode, User, Vent} from "./models";
import {HVAC, HVACPowerMode, HVACSwingMode, HVACMode, HVACFanSpeed} from "./models/hvac"
import {Room} from "./models/room";

interface Token {
    access_token: string,
    expires_at: Moment,
    token_type: string,
    scope: string,
    refresh_token: string
}


class Client {

    private passwordTokenConfig: {
        password: string;
        scope: string;
        client_secret: string;
        client_id: string;
        username: string,
        grant_type: string
    };

    private currentToken?: Token;

    private client: AxiosInstance;

    private static scopes = [
        'structures.edit',
        'structures.view',
        'pucks.view',
        'pucks.edit',
        'vents.view',
        'vents.edit',
        'users.view',
    ];
    private refreshTokenConfig: {
        grant_type: string;
        scope: string;
        client_secret: string;
        client_id: string
    };

    constructor(client_id: string, client_secret: string, username: string, password: string) {
        this.passwordTokenConfig = {
            username: username,
            password: password,
            scope: Client.scopes.join(' '),
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'password'
        };

        this.refreshTokenConfig = {
            scope: Client.scopes.join('+'),
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'refresh_token'
        };

        this.client = axios.create({
            baseURL: 'https://api.flair.co'
        });
    }

    /**
     * Gets a refresh token and saves to memory
     */
    private async getRefreshToken(): Promise<Token> {
        const requestURL = '/oauth/token?' + querystring.stringify(this.passwordTokenConfig);
        const response = await this.client.post(requestURL)
        if (response.status !== 200) {
            throw new Error("Getting refresh token failed.")
        }
        response.data.expires_at = moment().add(response.data.expires_in, 'seconds')
        return this.currentToken = response.data as Token
    }

    /**
     * Updates the access token saved in memory if we have a refresh token
     * otherwise gets a refresh token
     */
    private async updateAccessToken(): Promise<Token> {
        if (this.currentToken === undefined) {
            return this.getRefreshToken();
        } else if (this.currentToken.expires_at.isBefore(moment().subtract(20, 'seconds'))) {
            const requestURL = '/oauth/token?' + querystring.stringify({
                ...this.refreshTokenConfig,
                refresh_token: this.currentToken!.refresh_token
            });
            try {
                const response = await axios.post(requestURL)
                if (response.status !== 200) {
                    return this.getRefreshToken();
                }
                response.data.expires_at = moment().add(response.data.expires_in, 'seconds')
                this.currentToken = response.data
            } catch (e) {
                return this.getRefreshToken();
            }
        }

        return this.currentToken!
    }

    /**
     * Updates the authClient
     */
    private async updateClient() {
        await this.updateAccessToken();
        this.client.defaults.headers.common['Authorization'] = this.currentToken!.token_type + ' ' + this.currentToken!.access_token;
    }

    public async getUsers(): Promise<[User]> {
        await this.updateClient()
        let response = await this.client.get('/api/users')
        //TODO: Paginate
        return response.data.data.map((data: any): User => {
            return (new User()).fromJSON(data);
        });
    }

    public async getPucks(): Promise<[Puck]> {
        await this.updateClient()
        let response = await this.client.get('/api/pucks')
        //TODO: Paginate
        return response.data.data.map((data: any): Puck => {
            return (new Puck()).fromJSON(data);
        });
    }

    public async getVents(): Promise<[Vent]> {
        await this.updateClient()
        let response = await this.client.get('/api/vents')
        //TODO: Paginate
        return response.data.data.map((data: any): Vent => {
            return (new Vent()).fromJSON(data);
        });
    }

    public async getVentReading(vent: Vent): Promise<Vent> {
        await this.updateClient()
        let response = await this.client.get(`/api/vents/${vent.id}/current-reading`)
        vent.setCurrentReading(response.data.data)
        return vent;
    }

    public async setVentPercentOpen(vent: Vent, percentOpen: number): Promise<Vent> {
        await this.updateClient()
        let response = await this.client.patch(`/api/vents/${vent.id}`, {
            data: {
                type: "vents",
                attributes: {
                    "percent-open": percentOpen
                },
                relationships: {}
            }
        })
        vent.fromJSON(response.data.data)
        return vent;
    }

    public async getPuckReading(puck: Puck): Promise<Puck> {
        await this.updateClient()
        let response = await this.client.get(`/api/pucks/${puck.id}/current-reading`)
        puck.setCurrentReading(response.data.data)
        return puck;
    }

    public async getRooms(): Promise<[Room]> {
        await this.updateClient()
        let response = await this.client.get('/api/rooms')
        //TODO: Paginate
        return response.data.data.map((data: any): Room => {
            return (new Room()).fromJSON(data);
        });
    }

    public async getRoom(room: Room): Promise<Room> {
        await this.updateClient()
        let response = await this.client.get(`/api/rooms/${room.id}`)
        //TODO: Paginate
        return room.fromJSON(response.data.data);
    }

    public async setRoomSetPoint(room: Room, setPointC: number): Promise<Room> {
        await this.updateClient()
        let response = await this.client.patch(`/api/rooms/${room.id}`, {
            data: {
                type: "rooms",
                attributes: {
                    "set-point-c": setPointC
                },
                relationships: {}
            }
        })
        room.fromJSON(response.data.data)
        return room;
    }

    public async getStructures(): Promise<[Structure]> {
        await this.updateClient()
        let response = await this.client.get(`/api/structures`)
        //TODO: Paginate
        return response.data.data.map((data: any): Structure => {
            return (new Structure()).fromJSON(data);
        });
    }


    public async getStructure(structure: Structure): Promise<Structure> {
        await this.updateClient()
        let response = await this.client.get(`/api/structures/${structure.id}`)
        //TODO: Paginate
        return structure.fromJSON(response.data.data);
    }

    public async getPrimaryStructure(): Promise<Structure> {
        await this.updateClient()
        return (await this.getStructures()).find((structure: Structure) => {
            return structure.isPrimaryHome();
        })!;
    }

    public async setStructureMode(structure: Structure, mode: FlairMode): Promise<Structure> {
        await this.updateClient()
        let response = await this.client.patch(`/api/structures/${structure.id}`, {
            data: {
                type: "structures",
                attributes: {
                    "mode": mode
                },
                relationships: {}
            }
        })
        return structure.fromJSON(response.data.data)
    }

    public async setStructureHeatingCoolMode(structure: Structure, mode: StructureHeatCoolMode): Promise<Structure> {
        await this.updateClient()
        let response = await this.client.patch(`/api/structures/${structure.id}`, {
            data: {
                type: "structures",
                attributes: {
                    "structure-heat-cool-mode": mode
                },
                relationships: {}
            }
        })
        return structure.fromJSON(response.data.data)
    }

    public async getHVACs(structure: Structure): Promise<[HVAC]> {
        await this.updateClient()
        let response = await this.client.get(`/api/structures/${structure.id}/hvac-units`)
        //TODO: Paginate
        return response.data.data.map((data: any): HVAC => {
            return (new HVAC()).fromJSON(data);
        });
    }


    public async getHVAC(hvac: HVAC): Promise<HVAC> {
        await this.updateClient()
        let response = await this.client.get(`/api/hvac-units/${hvac.id}`)
        //TODO: Paginate
        return hvac.fromJSON(response.data.data);
    }

    public async setHVACPowerMode(hvac: HVAC, mode: HVACPowerMode): Promise<HVAC> {
        await this.updateClient()
        let response = await this.client.patch(`/api/hvac-units/${hvac.id}`, {
            data: {
                type: "hvac-units",
                attributes: {
                    "power": mode
                },
                relationships: {}
            }
        })
        return hvac.fromJSON(response.data.data)
    }

    public async setHVACSwingMode(hvac: HVAC, mode: HVACSwingMode): Promise<HVAC> {
        await this.updateClient()
        let response = await this.client.patch(`/api/hvac-units/${hvac.id}`, {
            data: {
                type: "hvac-units",
                attributes: {
                    "swing": mode
                },
                relationships: {}
            }
        })
        return hvac.fromJSON(response.data.data)
    }

    public async setHVACMode(hvac: HVAC, mode: HVACMode): Promise<HVAC> {
        await this.updateClient()
        let response = await this.client.patch(`/api/hvac-units/${hvac.id}`, {
            data: {
                type: "hvac-units",
                attributes: {
                    "mode": mode
                },
                relationships: {}
            }
        })
        return hvac.fromJSON(response.data.data)
    }

    public async setHVACFanSpeed(hvac: HVAC, mode: HVACFanSpeed): Promise<HVAC> {
        await this.updateClient()
        let response = await this.client.patch(`/api/hvac-units/${hvac.id}`, {
            data: {
                type: "hvac-units",
                attributes: {
                    "fan-speed": mode
                },
                relationships: {}
            }
        })
        return hvac.fromJSON(response.data.data)
    }

    public async setHVACTemperature(hvac: HVAC, temperature: number): Promise<HVAC> {
        await this.updateClient()
        const temperatureToSet = hvac.convertFromCToSetPointUnits(temperature);
        let response = await this.client.patch(`/api/hvac-units/${hvac.id}`, {
            data: {
                type: "hvac-units",
                attributes: {
                    "temperature": temperatureToSet
                },
                relationships: {}
            }
        })
        return hvac.fromJSON(response.data.data)
    }
}

export default Client;
