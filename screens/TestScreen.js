import React from 'react';
import { View, Text, Button, Image, ActivityIndicator, StyleSheet } from 'react-native';

// import { getSpotifyPlayer, playTrack } from '../utils/spotify.js';

class HomeScreen extends React.Component {

	constructor(props) {
		super(props); //ils sont vrmt supers
		this.state = {
			userId: null,
			imageSrc: null,
			savedTracks: [],
			trackPlaying: -1 // L'index du titre en cours de lecture
		};
		// fetch("https://api.spotify.com/v1/me", {
		// 	headers: {
		// 		'Authorization': `Bearer ${accessToken}`
		// 	}
		// })
		// .then(response => response.json())
		// .then(data => {
		// 	console.log(data);
		// 	this.setState({
		// 		userId: data.id,
		// 		imageSrc: data.images[0].url
		// 	});
		// });
	}

	// componentDidMount est une méthode React qui est appelée juste après la première exécution de render
	// Elle est pratique pour mettre des trucs à charger car elle peut être async
	async componentDidMount() {
		// On récupère notre player
		// this.player = await getSpotifyPlayer(this.props.accessToken);
		// this.player.on('ready', data => {
		// 	this.deviceId = data.device_id;
		// });
		// On récupère notre liste des titres likés
		const response = await fetch(`https://api.spotify.com/v1/me/tracks`, {
			headers: { 'Authorization': `Bearer ${this.props.accessToken}` }
		});
		const data = await response.json();
		this.setState({ savedTracks: data.items });
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={styles.wrapper}>
					<Text style={styles.title}>Mes titres likés</Text>
					{this.state.savedTracks.length == 0 &&
						<ActivityIndicator size='large' color='#61DBFB' />
					}
					{this.state.savedTracks.length > 0 &&
						<Button
							title="Lecture aléatoire"
							color='#61DBFB'
							onPress={() => {
								// Math.random() renvoie un nombre aléatoire entre 0 et 1
								// Math.floor() arrondit à l'entier inférieur
								// En pratique : random est un nombre entier entre 0 (inclus) et le nombre de tracks (exclu)
								const random = Math.floor(Math.random() * this.state.savedTracks.length);
								this.setState({ trackPlaying: random });
								// playTrack(this.state.savedTracks.map(e => e.track.id)[random], this.deviceId, this.props.accessToken);
							}} />
					}
					{this.state.savedTracks.map((e, i) => (
						<Text
							key={e.track.id}
							style={[styles.text, {
								// i (le deuxième paramètre après e) désigne l'index de l'élément dans le tableau
								// S'il correspond au titre en cours de lecture, on le met en bleu
								color: this.state.trackPlaying == i ? '#61DBFB' : 'white'
							}]}
							onPress={() => {
								this.setState({ trackPlaying: i })
								// playTrack(e.track.id, this.deviceId, this.props.accessToken);
							}}>
							{e.track.name} - {e.track.artists.map(e => e.name).join(', ')}
						</Text>
					))}
				</View>
			</View>
		);
	}
}

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111111',
		alignItems: 'center',
		justifyContent: 'center'
	},
	wrapper: {
		width: '75%',
		justifyContent: 'center',
		alignItems: 'center'
	},
	title: {
		color: '#61DBFB',
		fontSize: 25,
		textTransform: 'uppercase',
		marginVertical: 10
	},
	text: {
		color: 'white',
		fontSize: 12,
		alignSelf: 'flex-start',
		marginVertical: 5
	}
});
