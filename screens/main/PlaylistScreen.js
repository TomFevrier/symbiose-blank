import React from 'react';

import { View, FlatList, Image, Text, TouchableWithoutFeedback, TouchableHighlight, ActivityIndicator, StyleSheet } from 'react-native';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Track from '../../components/Track';

import I18n from '../../utils/i18n';
import Spotify from '../../utils/spotify';
import Fire from '../../utils/firebase';

import globalStyles from '../../globalStyles';

class PlaylistScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
	}

	async componentDidMount() {
		const tracks = await Spotify.getTracks(this.props.route.params.tracks);
		this.setState({ tracks });
		this.setState({ loading: false });
	}

	render() {
		return (
			<View style={styles.container}>
				{this.state.loading ?
					<ActivityIndicator
						style={{ position: 'absolute', alignSelf: 'center' }}
						size='large' color='#61DBFB' /> :
					<>
						<View style={styles.header}>
							<TouchableHighlight
								style={styles.button}
								onPress={() => this.props.navigation.goBack()}
							>
								<Ionicons
									name='ios-arrow-back' size={25}
									color='white' />
							</TouchableHighlight>
						</View>
						<View style={{ paddingBottom: 120 }}>
							{/*
							<Image
								style={this.state.type == 'artist' ?
									styles.artistImage : styles.playlistImage
								}
								source={{
									uri: this.state.type == 'artist' ?
										this.state.artist.images[0].url :
										this.state.playlist.images[0].url
								}} />
							*/}
							<Text style={styles.name}>
								{this.props.route.params.name}
							</Text>
							<FlatList
								data={this.state.tracks}
								renderItem={({ item, index }) => (
									<Track
										key={item.id}
										track={item}
										uris={this.state.tracks.map(e => e.uri)}
										separator={index > 0} />
								)}
								keyExtractor={e => e.id}
								showsVerticalScrollIndicator={false} />
						</View>
					</>
				}
			</View>
		);
	}
}

export default PlaylistScreen;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		backgroundColor: '#222',
		justifyContent: 'flex-start',
		alignItems : 'center',
	},
	header: {
		flexDirection: 'row',
		marginTop: 20,
		paddingHorizontal: 15,
		width: '100%',
		alignItems: 'flex-start'
	},
	button: {
		width: 40,
		aspectRatio: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'rgba(50, 50, 50, 0.8)',
		borderRadius: 40,
	},
	artistImage: {
		width: 150,
		aspectRatio: 1,
		borderRadius: 75,
		alignSelf: 'center',
		marginVertical: 5
	},
	playlistImage: {
		width: 150,
		aspectRatio: 1,
		alignSelf: 'center',
		marginVertical: 5
	},
	name: {
		fontFamily: 'Roboto',
		fontWeight: 'bold',
		color: 'white',
		fontSize: 20,
		textAlign: 'center',
		marginVertical: 10
	}
});
