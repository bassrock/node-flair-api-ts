import axios, { AxiosInstance } from 'axios';
import moment, { Moment } from 'moment';
import {
  FlairMode,
  Puck,
  Structure,
  StructureHeatCoolMode,
  User,
  Vent,
  Room,
} from './models';

export interface Token {
  access_token: string;
  expires_at: Moment;
  token_type: string;
  scope: string;
  refresh_token?: string;
}

/**
 * Which Flair token endpoint the client authenticates against.
 *
 * - `oauth2`: `/oauth2/token` with the `client_credentials` grant. This is what
 *   the client ID / secret shown in the Flair app (Account Settings ->
 *   Developer Settings) work with. No username or password is needed.
 * - `legacy`: `/oauth/token` with the `password` grant. Only works with the
 *   older credentials Flair used to hand out via its request form.
 */
type AuthMode = 'oauth2' | 'legacy';

export class Client {
  private passwordTokenConfig?: {
    password: string;
    scope: string;
    client_secret: string;
    client_id: string;
    username: string;
    grant_type: string;
  };

  private currentToken?: Token;

  private clientCredentialsTokenConfig: {
    grant_type: string;
    scope: string;
    client_id: string;
    client_secret: string;
  };

  private authMode?: AuthMode;

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
    client_id: string;
  };

  /**
   *
   * @param client_id
   * @param client_secret
   * @param username Only needed for legacy credentials
   * @param password Only needed for legacy credentials
   */
  constructor(
    client_id: string,
    client_secret: string,
    username?: string,
    password?: string
  ) {
    this.clientCredentialsTokenConfig = {
      scope: Client.scopes.join(' '),
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'client_credentials',
    };

    if (username && password) {
      this.passwordTokenConfig = {
        username: username,
        password: password,
        scope: Client.scopes.join(' '),
        client_id: client_id,
        client_secret: client_secret,
        grant_type: 'password',
      };
    }

    this.refreshTokenConfig = {
      scope: Client.scopes.join('+'),
      client_id: client_id,
      client_secret: client_secret,
      grant_type: 'refresh_token',
    };

    this.client = axios.create({
      baseURL: 'https://api.flair.co',
    });
  }

  /**
   * Gets a new token and saves it to memory.
   *
   * Tries the OAuth2 client credentials flow first, since that is what current
   * Flair developer credentials support. If Flair rejects the client there and
   * a username/password was supplied, falls back to the legacy password flow.
   * Whichever flow works is remembered for the lifetime of the client.
   */
  private async getRefreshToken(): Promise<Token> {
    if (this.authMode === 'legacy') {
      return this.getLegacyPasswordToken();
    }

    try {
      const token = await this.getClientCredentialsToken();
      this.authMode = 'oauth2';
      return token;
    } catch (e) {
      if (
        this.authMode === undefined &&
        this.passwordTokenConfig !== undefined &&
        Client.isClientRejection(e)
      ) {
        const token = await this.getLegacyPasswordToken();
        this.authMode = 'legacy';
        return token;
      }
      throw e;
    }
  }

  /**
   * OAuth2 client credentials flow against /oauth2/token
   */
  private async getClientCredentialsToken(): Promise<Token> {
    const response = await this.client.post(
      '/oauth2/token',
      new URLSearchParams(this.clientCredentialsTokenConfig).toString(),
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
    return this.saveToken(response.data);
  }

  /**
   * Legacy password flow against /oauth/token
   */
  private async getLegacyPasswordToken(): Promise<Token> {
    if (this.passwordTokenConfig === undefined) {
      throw new Error(
        'A username and password are required for legacy Flair credentials.',
      );
    }
    const requestURL =
      '/oauth/token?' +
      new URLSearchParams(this.passwordTokenConfig).toString();
    const response = await this.client.post(requestURL);
    if (response.status !== 200) {
      throw new Error('Getting refresh token failed.');
    }
    return this.saveToken(response.data);
  }

  private saveToken(data: any): Token {
    data.expires_at = moment().add(data.expires_in, 'seconds');
    return (this.currentToken = data as Token);
  }

  /**
   * True when Flair rejected the client credentials themselves (as opposed to
   * a network error or server outage).
   */
  private static isClientRejection(e: any): boolean {
    const status = e?.response?.status;
    return status === 400 || status === 401;
  }

  /**
   * Updates the access token saved in memory if we have a refresh token
   * otherwise gets a refresh token
   *
   * @returns Promise<Token>
   */
  private async updateAccessToken(): Promise<Token> {
    if (this.currentToken === undefined) {
      return this.getRefreshToken();
    } else if (
      this.currentToken.expires_at.isBefore(moment().subtract(20, 'seconds'))
    ) {
      if (this.authMode === 'oauth2' || !this.currentToken.refresh_token) {
        return this.getRefreshToken();
      }
      const requestURL =
        '/oauth/token?' +
        new URLSearchParams({
          ...this.refreshTokenConfig,
          refresh_token: this.currentToken!.refresh_token,
        }).toString();
      try {
        const response = await axios.post(requestURL);
        if (response.status !== 200) {
          return this.getRefreshToken();
        }
        response.data.expires_at = moment().add(
          response.data.expires_in,
          'seconds'
        );
        this.currentToken = response.data;
      } catch (e) {
        return this.getRefreshToken();
      }
    }

    return this.currentToken!;
  }

  /**
   * Updates the authClient
   */
  private async updateClient() {
    await this.updateAccessToken();
    this.client.defaults.headers.common.Authorization =
      this.currentToken!.token_type + ' ' + this.currentToken!.access_token;
  }

  /**
   *
   * @returns Promise<[User]>
   */
  public async getUsers(): Promise<[User]> {
    await this.updateClient();
    const response = await this.client.get('/api/users');
    //TODO: Paginate
    return response.data.data.map((data: any): User => {
      return new User().fromJSON(data);
    });
  }

  /**
   *
   * @returns
   */
  public async getPucks(): Promise<[Puck]> {
    await this.updateClient();
    const response = await this.client.get('/api/pucks');
    //TODO: Paginate
    return response.data.data.map((data: any): Puck => {
      return new Puck().fromJSON(data);
    });
  }

  /**
   *
   * @returns
   */
  public async getVents(): Promise<[Vent]> {
    await this.updateClient();
    const response = await this.client.get('/api/vents');
    //TODO: Paginate
    return response.data.data.map((data: any): Vent => {
      return new Vent().fromJSON(data);
    });
  }

  /**
   *
   * @param vent
   * @returns
   */
  public async getVentReading(vent: Vent): Promise<Vent> {
    await this.updateClient();
    const response = await this.client.get(
      `/api/vents/${vent.id}/current-reading`
    );
    vent.setCurrentReading(response.data.data);
    return vent;
  }

  /**
   *
   * @param vent
   * @param percentOpen
   * @returns
   */
  public async setVentPercentOpen(
    vent: Vent,
    percentOpen: number
  ): Promise<Vent> {
    await this.updateClient();
    const response = await this.client.patch(`/api/vents/${vent.id}`, {
      data: {
        type: 'vents',
        attributes: {
          'percent-open': percentOpen,
        },
        relationships: {},
      },
    });
    vent.fromJSON(response.data.data);
    return vent;
  }

  /**
   *
   * @param puck
   * @returns
   */
  public async getPuckReading(puck: Puck): Promise<Puck> {
    await this.updateClient();
    const response = await this.client.get(
      `/api/pucks/${puck.id}/current-reading`
    );
    puck.setCurrentReading(response.data.data);
    return puck;
  }

  /**
   *
   * @returns
   */
  public async getRooms(): Promise<[Room]> {
    await this.updateClient();
    const response = await this.client.get('/api/rooms');
    //TODO: Paginate
    return response.data.data.map((data: any): Room => {
      return new Room().fromJSON(data);
    });
  }

  /**
   *
   * @param room
   * @returns
   */
  public async getRoom(room: Room): Promise<Room> {
    await this.updateClient();
    const response = await this.client.get(`/api/rooms/${room.id}`);
    //TODO: Paginate
    return room.fromJSON(response.data.data);
  }

  /**
   *
   * @param room
   * @param setPointC
   * @returns
   */
  public async setRoomSetPoint(room: Room, setPointC: number): Promise<Room> {
    await this.updateClient();
    const response = await this.client.patch(`/api/rooms/${room.id}`, {
      data: {
        type: 'rooms',
        attributes: {
          'set-point-c': setPointC,
        },
        relationships: {},
      },
    });
    room.fromJSON(response.data.data);
    return room;
  }

  /**
   * Sets if you are away in the room
   * @param room
   * @param setAway
   * @returns
   */
  public async setRoomAway(room: Room, setAway: boolean): Promise<Room> {
    await this.updateClient();
    const response = await this.client.patch(`/api/rooms/${room.id}`, {
      data: {
        type: 'rooms',
        attributes: {
          active: !setAway,
        },
        relationships: {},
      },
    });
    room.fromJSON(response.data.data);
    return room;
  }

  /**
   *
   * @returns
   */
  public async getStructures(): Promise<[Structure]> {
    await this.updateClient();
    const response = await this.client.get('/api/structures');
    //TODO: Paginate
    return response.data.data.map((data: any): Structure => {
      return new Structure().fromJSON(data);
    });
  }

  /**
   *
   * @param structure
   * @returns
   */
  public async getStructure(structure: Structure): Promise<Structure> {
    await this.updateClient();
    const response = await this.client.get(`/api/structures/${structure.id}`);
    //TODO: Paginate
    return structure.fromJSON(response.data.data);
  }

  /**
   *
   * @returns
   */
  public async getPrimaryStructure(): Promise<Structure> {
    await this.updateClient();
    return (await this.getStructures()).find((structure: Structure) => {
      return structure.isPrimaryHome();
    })!;
  }

  /**
   * Set the structure mode which usually means auto or manual mode.
   * @param structure
   * @param mode
   * @returns
   */
  public async setStructureMode(
    structure: Structure,
    mode: FlairMode
  ): Promise<Structure> {
    await this.updateClient();
    const response = await this.client.patch(
      `/api/structures/${structure.id}`,
      {
        data: {
          type: 'structures',
          attributes: {
            mode: mode,
          },
          relationships: {},
        },
      }
    );
    return structure.fromJSON(response.data.data);
  }

  /**
   *
   * @param structure
   * @param mode
   * @returns
   */
  public async setStructureHeatingCoolMode(
    structure: Structure,
    mode: StructureHeatCoolMode
  ): Promise<Structure> {
    await this.updateClient();
    const response = await this.client.patch(
      `/api/structures/${structure.id}`,
      {
        data: {
          type: 'structures',
          attributes: {
            'structure-heat-cool-mode': mode,
          },
          relationships: {},
        },
      }
    );
    return structure.fromJSON(response.data.data);
  }

  /**
   *
   * @param structure
   * @param setPointC
   * @returns
   */
  public async setStructureSetPoint(
    structure: Structure,
    setPointC: number
  ): Promise<Structure> {
    await this.updateClient();
    const response = await this.client.patch(
      `/api/structures/${structure.id}`,
      {
        data: {
          type: 'structures',
          attributes: {
            'set-point-temperature-c': setPointC,
          },
          relationships: {},
        },
      }
    );
    structure.fromJSON(response.data.data);
    return structure;
  }
}
