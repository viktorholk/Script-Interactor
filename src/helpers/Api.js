const axios         = require('axios');
const Logger = require('./Logger');
/**
 * API class connects to the api.tactoctical.com and gets a OAuth token from the Script-interacter client-id and secret and returns it
 * It can also connect to the Twitch API to check if a user is following or not
 */
class Api{
    // Singleton class
    static _INSTANCE = null;

    static Instance(){
        if (this._INSTANCE === null){
            this._INSTANCE = new Api();
        }
        return this._INSTANCE;
    }

    constructor(){
        this.api    = 'https://api.twitch.tv/helix/'
        this.token  = null;
        // Create axios instance with client id in common header
        this.axios  = axios.create({
            headers:{
                common:{
                    'Client-Id': 'm47mvaevmze4cnkb8ziotc10dct21y'
                }
            }
        });

        this.axios.interceptors.response.use(this.handleSuccess, this.handleError);
    }

    handleSuccess(response){
        return response
    }

    handleError(error){
        return Promise.reject(
            Logger.Instance().log(`ERROR: ${error}`, 3)
        );
    }

    validateToken(){
        // Returns the token from api.tactoctical.com
        // Check if there already is a token, then check if it is valid and if it is not return a new token
        if (this.token !== null){
            return this.axios.get('https://id.twitch.tv/oauth2/validate', { headers: { Authorization: `OAuth ${this.token}`}}).then(
                (response) => {  Logger.Instance().log('Bearer token is valid', 1); return this.token}
            ).catch(
                (err) => {
                    return this.axios.get('https://api.tactoctical.com/twitch-app/token').then(
                        (response) => { 
                            this.token = response.data['results']['access_token'];
                            // Set the token in the header
                            this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                            Logger.Instance().log('Updated bearer token', 1);
                            return this.token;
                        });
                 });
        }
        // return a new token
        return this.axios.get('https://api.tactoctical.com/twitch-app/token').then(
            (response) => { 
                this.token = response.data['results']['access_token'] ;
                // Set the token in the header
                this.axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
                Logger.Instance().log('Applied bearer token', 2);
                return this.token;
            });
    }


    async get(path, callback){
        // Validate token
        await this.validateToken();
        // Get the full path
        path = this.api + path;
        //make request and use callback
        return this.axios.get(path).then(
            (response) => callback(response.status, response.data)
        );
    }

    async isFollowing(userid){
        // Check if a userid is a follower to the broadcaster channel
        // get username
        const opts = Wrapper.Instance().ReadJson(Wrapper.Instance().configPath)['opts'];
        return this.get(`users/follows?from_id=${userid}`, (status, response) => {
            let _isFollowing = false;
            for (let i in response['data']){
                let to_name = response['data'][i]['to_name'];
                if (to_name === opts.identity.username){
                    _isFollowing = true;
                    break;
                }
            }
            return _isFollowing;
        })
    }
}
module.exports = Api;