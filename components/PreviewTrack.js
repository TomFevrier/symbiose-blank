import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import Spotify from '../utils/spotify';

class PreviewTrack extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { track, text, style } = this.props;
		return (
			<View style={[styles.container, style]}>
				<TouchableOpacity
					onPress={() => Spotify.play({
						trackUri: track.uri
					})}
					onLongPress={() => {
						Spotify.pause();
						Spotify.playPreview(track.id);
					}}
					onPressOut={() => {
						Spotify.stopPreview();
						Spotify.play();
					}}
				>
					<Image
						style={styles.image}
						source={{ uri: track.album.images[0].url }}
						resizeMode='contain' />
					<View style={styles.textContainer}>
						<Text style={[styles.text, {
							fontSize: 20,
							fontWeight: 'bold'
						}]}
						>
							{text}
						</Text>
						<Text style={styles.text}>{track.name}</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

export default PreviewTrack;

const styles = StyleSheet.create({
	container: {
		width: '33.33%',
		position: 'relative'
	},
	image: {
		width: '100%',
		aspectRatio: 1
	},
	grid: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '100%',
		aspectRatio: 1,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	imageSmall: {
		width: '50%',
		aspectRatio: 1
	},
	textContainer: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#61DBFB66'
	},
	text: {
		fontFamily: 'Roboto',
		color: 'white',
		textAlign: 'center'
	}
});
