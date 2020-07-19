import React from 'react';

import { View, Image, Text, TouchableWithoutFeedback, StatusBar, StyleSheet } from 'react-native';

import { MaterialCommunityIcons } from '@expo/vector-icons';

import I18n from '../utils/i18n';
import Spotify from '../utils/spotify';
import Fire from '../utils/firebase';

import globalStyles from '../globalStyles';

class Player extends React.Component {

	constructor() {
		super();
		this.state = {
			playing: true
		};
	}

	componentDidMount() {
		this.unsubscribe = Fire.shared.firestore.collection('users').doc(Fire.shared.uid)
			.onSnapshot(async (doc) => {
				const currentlyPlaying = doc.data().currentlyPlaying;
				if (!currentlyPlaying)
					this.setState({ playing: false });
				else {
					const track = await Spotify.get(`/tracks/${currentlyPlaying}`);
					this.setState({
						title : track.name,
						artist: track.artists.map(e => e.name).join(', '),
						image : track.album.images[1].url,
						playing: true,
						progress: doc.data().progress,
						duration: track.duration_ms
					});
				}
			});
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		return (
			<View style={styles.container}>
				<View style={{
					alignItems: 'center',
					position: 'relative',
					height: '100%'
				}}>
					<TouchableWithoutFeedback onPress={() => {
						if (this.state.playing)
							Spotify.pause();
						else
							Spotify.play();
						this.setState({ playing: !this.state.playing });
					}}>
						<View>
								<Image
									source={{ uri : this.state.image }}
									style={styles.image} />
								<View style={styles.button}>
									{this.state.playing ?
										<MaterialCommunityIcons
											name='pause'
											color='white'
											size={40}/> :
										<MaterialCommunityIcons
											name='play'
											color='white'
											size={40}/>
									}
								</View>
							</View>
						</TouchableWithoutFeedback>
				</View>
				<View style={{
					flex: 1,
					justifyContent: 'space-around',
					alignItems: 'center',
					height: '100%'
				}}>
					<Text style={globalStyles.text}>
						<Text>{this.state.title}</Text>
						<Text style={{ color: 'lightgrey' }}>  |  {this.state.artist}</Text>
					</Text>
					<View style={{ width: 200}}>
						<View style={[styles.progress, {
							width: 200,
							backgroundColor: '#222'
						}]} />
						<View style={[styles.progress, {
							width: this.state.progress / this.state.duration * 200 || 0
						}]} />
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		height: 75,
		width: '100%',
		backgroundColor: '#333',
		alignItems : 'center',
		justifyContent : 'space-around',
		marginTop: StatusBar.currentHeight,
		elevation: 5
	},
	image: {
		height: '100%',
		aspectRatio: 1
	},
	button: {
		width: '100%',
		height: '100%',
		position: 'absolute',
		alignItems: 'center',
		justifyContent: 'center'
	},
	progress : {
		position: 'absolute',
		backgroundColor: '#61DBFB',
		height: 2
	}
})

export default Player;
