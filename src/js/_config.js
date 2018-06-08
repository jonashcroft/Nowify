const config = {
    base_url     : 'https://api.spotify.com/v1/',
    client_id    : '*** YOUR CLIENT ID ***',
    client_secret: '*** YOUR CLIENT SECRET ***',
    user_token   : '',
    // Page Elements:
    connectDiv   : document.getElementById('auth'),
    nowPlayingDiv: document.getElementById('nowPlaying'),
    backgroundDiv: document.getElementById('background'),
    idleDiv      : document.getElementById('idle')

};

// module.exports = config;
export default config;