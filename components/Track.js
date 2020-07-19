import React from 'react';
import { TouchableHighlight, View, Image, Text, StyleSheet } from 'react-native';

import Spotify from '../utils/spotify';

import globalStyles from '../globalStyles';

const Track = ({ track, uris, separator }) => (
	<TouchableHighlight
		key={track.id}
		onPress={() => Spotify.play({
			trackUri: track.uri,
			uris: uris
		})}
		onLongPress={() => {
			Spotify.pause();
			Spotify.playPreview(track.id);
		}}
		onPressOut={() => {
			Spotify.stopPreview();
			Spotify.play();
		}}>
		<View style={[styles.track, separator && {
			borderTopColor: 'white',
			borderTopWidth: 1,
		}]}>
			<Image
				style={styles.albumImage}
				source={{ uri: track.image || track.album.images[0].url }} />
			<Text style={globalStyles.text}>{track.name}</Text>
		</View>
	</TouchableHighlight>
);

export default Track;

const styles = StyleSheet.create({
	track: {
		flex: 1,
		height: 75,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10
	},
	albumImage: {
		height: '100%',
		aspectRatio: 1,
		margin: 10
	}
});
