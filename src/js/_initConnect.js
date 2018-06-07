import config from './_config.js';
import { initAuthorise, getAccessToken } from './_auth.js';

const initConnect = () => {

    let element = document.getElementById('connect');

    config.connectDiv.classList.remove('inactive');
    config.connectDiv.classList.add('active');
    config.nowPlayingDiv.classList.remove('active');
    config.nowPlayingDiv.classList.add('inactive');

    element.addEventListener('click', () => {

        // If any previous Track data exists, delete it.
        localStorage.clear();

        initAuthorise();

    }, false);

};

export default initConnect;