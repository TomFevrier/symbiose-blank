# Symbiose App Prototype

This prototype is built with [React Native](https://reactnative.dev/). It uses [Firebase](https://firebase.google.com/) to store all the data, and [the Spotify API](https://developer.spotify.com/) for many features.

For Spotify authentification, this prototype also needs a server, whose code you can find [here](https://github.com/TomFevrier/symbiose-server-blank).

To run the app on an Android device (or an emulator), you need to install the Android SDK and Android Studio (see [the documentation](https://reactnative.dev/docs/environment-setup)).

### Getting started

- Set up a Spotify developer account and create a new app

- Set up a Firebase account and create a new app and add a Firestore database to it (architecture is detailed below)

- Replace the placeholders in the following files with your Spotify and Firebase credentials as well as the URL of [your hosted server](https://github.com/TomFevrier/symbiose-server-blank): `utils/firebase.js`, `utils/spotify.js` and `screens/auth/LinkScreen.js`

- Launch locally or deploy [the server](https://github.com/TomFevrier/symbiose-server-blank) (do not forget to whitelist the URL on the Spotify Developer Dashboard)

- You might also need to [generate a new Android debug key and add it to your app on the Spotify Developer Dashboard](https://developer.spotify.com/documentation/android/quick-start/index%20copy/#register-app-fingerprints)

- `npm install` to install all dependencies

### Running locally

- `npm run start` to start the development server
- `npm run android` to run the app on an Android device (or an emulator)

## Data modelling for Firestore

- `users`:
	- `id` *(string)*: id of the user (used by Firebase authentification)
	- `username` *(string)*
	- `usernameLowerCase` *(string)*: used for authentification and user search
	- `firstName` *(string)*
	- `lastName` *(string)*
	- `email` *(string)*
	- `accessToken` *(string)*: Spotify access token for this user
	- `expirationDate` *(string)*: Spotify access token expiration timestamp
	- `refreshToken` *(string)*: Spotify refresh token for this user
	- `profileImage` *(string)*: URL for the profile picture (pulled from Spotify)
	- `artistOfTheMonth` *(string)*: Spotify id for the user's artist of the month
	- `mostPlayedTrack` *(string)*: Spotify id for the user's most played track
	- `lastSavedTrack` *(string)*: Spotify id for the user's last saved track
	artistOfTheMonth "1hCkSJcXREhrodeIHQdav8"
	- `creationDate` *(number)*: timestamp for the user creation


- `follows`:
	- `followeeId` *(string)*: id of the user being followed
	- `followerId` *(string)*: id of the user following


- `posts`:
	- `uid` *(string)*: user id
	- `text` *(string)*
	- `likes` *(string[])*: array of ids for the users who liked the post
	- `reposts` *(string[])*: array of ids for the users who reposted the post
	- `timestamp` *(number)*: timestamp for the post creation
	- `opid` *(string)*: if the post is a repost, id for the original post (in which case the only fields necessary are `uid`, `opid` and `timestamp`)


- `playlists`:
	- `name` *(string)*
	- `owners` *(string[])*: array of the ids of the playlist owner(s)
	- `pictures` *(string[])*: array of up to 4 pictures to generate the thumbnail of the playlist
	- `tracks` *(string[])*: array of Spotify track ids
	- `spotifyId` *(string)*: id of the playlist if it was imported from Spotify
	- `private` *(boolean)*: privacy of the playlist
	- `timestamp` *(number)*: timestamp for the playlist creation
