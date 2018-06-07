import init from './_init.js';

class nowify {

	constructor() {
		document.addEventListener('DOMContentLoaded', () => this.domReady());
    }

	domReady() {
		init();
	}

}

export default nowify;

new nowify;