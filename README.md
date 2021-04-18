# Nowify

A simple app to display your currently playing Spotify track on a Raspberry Pi, made with Vue.

Nowify will:

* ✅ - Use Spotify Web API to get your current track
* ✅ - Only access that and no other data
* ✅ - Use Access and Refresh Tokens to ensure that you're kept logged in between sessions
* ✅ - Display the current track artist, cover, and a matching vibrant background colour

Preview:
![Nowify Preview Image 1](assets/preview-1.png?raw=true "Nowify preview image, cover art for the song 'Wherever you go' by The Avalanches and Jamie xx")
![Nowify Preview Image 2](assets/preview-2.png?raw=true "Nowify preview image, cover art for the song 'Gas Drawls' by MF DOOM")
![Nowify Preview Image 3](assets/preview-3.png?raw=true "Nowify preview image, cover art for the song '有吗炒面' by Lexie Liu")
---

## How to use:
Nowify needs a webserver to run. The quickest way to get up and running is to use a Jamstack platform like Netlify or GitHub Pages:

* Fork the repository
* Connect your repo to your platform
* Add your Spotify Client ID and Client Secret to environment variables
* Deploy!

Alternatively, you can clone the repo, compile the code offline, and upload to your own webserver.

To compile the code, you will need a package manager installed. Either [npm](https://www.npmjs.com/get-npm) or [yarn](https://classic.yarnpkg.com/en/docs/install/#mac-stable). I use yarn.

### 1. Create Spotify Client keys.
To allow authorisation to your track data, you'll need to generate client keys. You can do this by logging in to the [Spotify Dashboard](https://developer.spotify.com/dashboard/applications) creating an app.

If you're deploying to a Jamstack platform, add these to your Environment variables using the names defined in `.env.sample`,

When you create your Client keys, you must also set the 'Redirect URI' as the URL of your app, so that Spotify redirects you back to Nowify when you authorise your account. The URI will be some variation of 'http://localhost:8080' or 'https://mywebapp.com'.

### 2. Clone this repository and install dependencies
After you clone, navigate to the directory and install the dependencies:

via yarn:
```
yarn install
```

via npm:
```
npm install
```

### 3. Add your Client ID and Client Secret
Copy the `.env.sample` file to a new file called `.env` and enter your generated Client ID and Client Secret.

### 4. Compile the code
In the repo directory, run the following command to compile the project:

via yarn:
```
yarn build
```

via npm:
```
npm run build
```

You can also run the development version locally on your machine:

via yarn:
```
yarn serve
```

via npm:
```
npm run serve
```

### 5. Upload to a webserver.
The output of `yarn build` will be created in a folder called `/dist/` - this is the usable version of Nowify which is ready to be added to your web server.

> *NOTE*: 🚨 This app uses Environment Variables to keep your Client ID and Secret secure. These will not be added to your compiled code, so you must set these within your server. Please consult your server documentation on how to handle these.

### 6. View on your Pi and play some music.
Now you're ready to go. Open your site on the Raspberry Pi, login, and play some music. I'd recommend disabling the screensaver on your Pi and opening Chromium in kiosk mode.

If using Raspbian, to disable screen-off:

Open autostart:
```
sudo nano /etc/xdg/lxsession/LXDE-pi/autostart
```

Add the following 2 commands to what is already there:
```
@xset s off
@xset -dpms
```

Launch Chromium in kiosk mode (full-screen, no toolbars):
```
DISPLAY=:0 chromium-browser -kiosk https://[your-url] # open up chromium to specific web page
```
---
### Original Write up:
[https://ashcroft.dev/blog/now-playing-screen-spotify-raspberry-pi-es6/](https://ashcroft.dev/blog/now-playing-screen-spotify-raspberry-pi-es6/)

### Brief About:
Nowify was a project that I originally made in 2017 when I wanted to learn more modern Javascript. Over the years, I've learned a lot more and had people contact me about Nowify, so I wanted to build a more modern version of it using modern tools. This is still a learning exercise, but hopefully one that's more usable. If you'd like to view the old repository, that can be found on the `old` branch.