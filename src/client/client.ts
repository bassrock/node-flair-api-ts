import axios, {AxiosInstance} from "axios";
import * as querystring from 'query-string';
import moment, {Moment} from 'moment';
import {User} from "./models";
import {Model} from "./models/model";

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
            scope: Client.scopes.join(' '),
            client_id: client_id,
            client_secret: client_secret,
            grant_type: 'refresh_token'
        };

        this.client = axios.create({
            baseURL: 'https://api.flair.co'
        });
        //this.addMiddleware(this.client)
    }

    private addMiddleware(client: AxiosInstance) {
        // const idToPath = {
        //     name: 'id-to-path-request',
        //     req: (payload: any) => {
        //         if (payload.req.params.id !== undefined) {
        //             payload.req.url += `/${payload.req.params.id}`
        //             delete payload.req.params.id;
        //         }
        //         return payload;
        //     }
        // }

        const modelDeserializer = {
            name: 'model-deserializer',
            res: (payload: any) => {
                let {data} = payload.res.data;
                if (!Array.isArray(data))
                    data = [data];

                console.log(data)

            }
        }

        //client.insertMiddlewareBefore('axios-request', idToPath);
       // client.insertMiddlewareBefore('response', modelDeserializer);
    }

    /**
     * Gets a refresh token and saves to memory
     */
    private async getRefreshToken(): Promise<Token> {
        const requestURL = '/oauth/token?' + querystring.stringify(this.passwordTokenConfig);
        const response = await this.client.post(requestURL)
        response.data.expires_in = moment().add(response.data.expires_in, 'seconds')
        return this.currentToken = response.data as Token
    }

    /**
     * Updates the access token saved in memory if we have a refresh token
     * otherwise gets a refresh token
     */
    private async updateAccessToken(): Promise<Token> {
        if (this.currentToken === undefined) {
            return this.getRefreshToken();
        } else if (this.currentToken.expires_at.isBefore(new Date())) {
            const requestURL = '/oauth/token?' + querystring.stringify({
                ...this.refreshTokenConfig,
                refresh_token: this.currentToken!.refresh_token
            });
            const response = await axios.post(requestURL)
            response.data.expires_in = moment().add(response.data.expires_in, 'seconds')
            this.currentToken = response.data
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


    public async getUsers() : Promise<[User]> {
        await this.updateClient()
        let response = await this.client.get('/api/users')
        //TODO: Paginate
        return response.data as [User];
    }
}

export default Client;
