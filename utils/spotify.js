import Fire from './firebase';
import { Audio } from 'expo-av';

import { Linking } from 'react-native';

import {
	auth as SpotifyAuth,
	remote as SpotifyRemote,
	ApiScope,
	ApiConfig
} from 'react-native-spotify-remote';

const spotifyConfig = {
	clientID: 'SPOTIFY_CLIENT_ID',
	redirectURL: 'symbiose://',
	tokenSwapURL: 'SERVER_URL/callback', // see repo symbiose-server-blank
	tokenRefreshURL: 'SERVER_URL/refresh',
	// tokenSwapURL: 'http://locahost:8888/callback',
	// tokenRefreshURL: 'http://locahost:8888/refresh',
	scopes: [ApiScope.AppRemoteControlScope, ApiScope.UserFollowReadScope],
	showDialog: false
}

const local = false;

class Spotify {
	static sound = null;

	static async init() {
		await SpotifyAuth.authorize(spotifyConfig);
	}

	static async transferPlayback() {
		const devices = await this.get('/me/player/devices');
		return devices;
	}

	static async getCredentials() {
		const credentials = await Fire.shared.getSpotifyCredentials();
		if (Date.now() >= credentials.expirationDate) {
			await fetch(`${local ? 'http://localhost:8888' : 'SERVER_URL'}/refresh?refreshToken=${credentials.refreshToken}&uid=${Fire.shared.uid}`);
			return (await Fire.shared.getSpotifyCredentials());
		}
		else
			return credentials;
	}

	static async get(endPoint) {
		const credentials = await this.getCredentials();
		const response = await fetch(`https://api.spotify.com/v1${endPoint}`, {
			headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
		});
		const result = await response.json();
		return result;
	}

	static async getTracks(trackIds) {
		let tracks = [];
		for (let i = 0; i < trackIds.length; i += 50) {
			tracks = [
				...tracks,
				...(await this.get(`/tracks?ids=${trackIds.slice(i, i + 50).join(',')}`)).tracks
			];
		}
		console.log(tracks)
		return tracks;
	}

	static async play({ trackUri, uris } = {}) {
		const session = await SpotifyAuth.getSession();
		if (!session) return;
		await SpotifyRemote.connect(session.token);
		await SpotifyRemote.playUri(trackUri);


		// const devices = (await Spotify.get('/me/player/devices')).devices;
		// if (devices.length == 0) return;
		// console.log(JSON.stringify({
		// 	device_ids: [devices[0].id]
		// }))
		// await fetch('https://api.spotify.com/v1/me/player', {
		// 	method: 'PUT',
		// 	body: JSON.stringify({
		// 		device_ids: [devices[0].id]
		// 	}),
		// 	headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
		// });

		// const options = {
		// 	method: 'PUT',
		// 	headers: {
		// 		'Authorization': `Bearer ${credentials.accessToken}`
		// 	}
		// };
		// if (trackUri) {
		// 	options.body = JSON.stringify({
		// 		uris: [trackUri]
		// 	});
		// }
		// if (uris) {
		// 	options.body = JSON.stringify({
		// 		uris: uris,
		// 		offset: { uri: trackUri }
		// 	});
		// }
		// await fetch('https://api.spotify.com/v1/me/player/play', options);
	}

	static async playPreview(id){
		const credentials = await this.getCredentials();
		const preview = (await this.get(`/tracks/${id}`)).preview_url;
		// if (this.sound) await this.stopPreview();
		this.sound = new Audio.Sound();
		await this.sound.loadAsync({uri : preview});
		this.sound.playAsync();
	}

	static async stopPreview(){
		await this.sound.stopAsync();
		await this.sound.unloadAsync();
	}

	static async pause() {
		const credentials = await this.getCredentials();
		const options = {
			method: 'PUT',
			headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
		};
		await fetch('https://api.spotify.com/v1/me/player/pause', options);
	}

	static async playPlaylist(playlistUri) {
		const credentials = await Fire.shared.getSpotifyCredentials();
		if (Date.now() >= credentials.expirationDate) {
			await fetch(`${local ?
				'http://localhost:8888' :
				'SERVER_URL'}/refresh?refreshToken=${credentials.refreshToken}&uid=${Fire.shared.uid}`);
			const credentials = await Fire.shared.getSpotifyCredentials();
		}
		const options = {
			method: 'PUT',
			body: JSON.stringify({
				context_uri: playlistUri
			}),
			headers: { 'Authorization': `Bearer ${credentials.accessToken}` }
		};
		await fetch('https://api.spotify.com/v1/me/player/play', options);
	}

	static subscribePlayer() {
		SpotifyRemote.addListener('playerStateChanged', state => {
			console.log(state)
		});
		this.interval = setInterval(async () => {
			const currentlyPlaying = await this.get('/me/player/currently-playing');
			if (currentlyPlaying && currentlyPlaying.is_playing) {
				Fire.shared.updateData({
					currentlyPlaying: currentlyPlaying.item.id,
					progress : currentlyPlaying.progress_ms
				});
			}
			else
				Fire.shared.deleteField('currentlyPlaying');

		}, 1000);
	}

	static async unsubscribePlayer() {
		clearInterval(this.interval);
		const doc = await Fire.shared.firestore.collection('users').doc(Fire.shared.uid).get();
		await Fire.shared.deleteField('currentlyPlaying');
	}
}

Spotify.init();

export default Spotify;
