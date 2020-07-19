import React from 'react';

import {
	View,
	ScrollView,
	Text,
	Image,
	ActivityIndicator,
	TouchableHighlight,
	StyleSheet
} from 'react-native';

import Preview from '../../components/Preview';
import Button from '../../components/Button';
import ModalFullHeight from '../../components/ModalFullHeight';

import Fire from '../../utils/firebase';
import Spotify from '../../utils/spotify';
import I18n from '../../utils/i18n';

class TestScrollView extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			loading: true,
			playlistImportationModalVisible: false,
			playlistsImported: []
		};
		this.fetchPlaylists = this.fetchPlaylists.bind(this);
		this.selectPlaylist = this.selectPlaylist.bind(this);
	}

	async componentDidMount() {
		const pinnedData = await Fire.shared.getPinnedData(this.props.uid);

		if (Object.values(pinnedData).filter(e => !e).length > 0) return;

		const artistOfTheMonth = await Spotify.get(`/artists/${pinnedData.artistOfTheMonth}`);
		const lastSavedTrack = await Spotify.get(`/tracks/${pinnedData.lastSavedTrack}`);
		const mostPlayedTrack = await Spotify.get(`/tracks/${pinnedData.mostPlayedTrack}`);

		await this.setState({
			artistOfTheMonth,
			lastSavedTrack,
			mostPlayedTrack
		});

		this.setState({ loading: false });
	}

	async fetchPlaylists() {
		const playlists = (await Spotify.get('/me/playlists')).items;
		this.setState({
			playlists: playlists,
			playlistsSelected: [],
			playlistImportationModalVisible: true
		});
	}

	selectPlaylist(i) {
		if (this.state.playlistsSelected.indexOf(i) < 0) {
			this.setState({
				playlistsSelected: [...this.state.playlistsSelected, i]
			});
		}
		else {
			this.setState({
				playlistsSelected: this.state.playlistsSelected.filter(e => e !== i)
			});
		}
	}

	render() {
		console.log(this.state.playlistsSelected, this.state.playlistsImported.map(e => e.name))
		return(
			<View style={{ flex: 1 }}>
				{!this.state.loading &&
				<ScrollView contentContainerStyle={[
						styles.grid,
						{ justifyContent: this.state.loading ? 'center' : 'flex-start' }
					]}>
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
							text={I18n.t('profile.artistOfTheMonth')}
							name={this.state.artistOfTheMonth.name}
							image={this.state.artistOfTheMonth.images[2].url}
							onPress={() => {
								this.props.navigation.navigate('Playlist', {
									type: 'artist',
									id: this.state.artistOfTheMonth.id
								});
							}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
								text={I18n.t('profile.artistOfTheMonth')}
								name={this.state.artistOfTheMonth.name}
								image={this.state.artistOfTheMonth.images[2].url}
								onPress={() => {
									this.props.navigation.navigate('Playlist', {
										type: 'artist',
										id: this.state.artistOfTheMonth.id
									});
								}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
							text={I18n.t('profile.artistOfTheMonth')}
							name={this.state.artistOfTheMonth.name}
							image={this.state.artistOfTheMonth.images[2].url}
							onPress={() => {
								this.props.navigation.navigate('Playlist', {
									type: 'artist',
									id: this.state.artistOfTheMonth.id
								});
							}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
								text={I18n.t('profile.artistOfTheMonth')}
								name={this.state.artistOfTheMonth.name}
								image={this.state.artistOfTheMonth.images[2].url}
								onPress={() => {
									this.props.navigation.navigate('Playlist', {
										type: 'artist',
										id: this.state.artistOfTheMonth.id
									});
								}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
							text={I18n.t('profile.artistOfTheMonth')}
							name={this.state.artistOfTheMonth.name}
							image={this.state.artistOfTheMonth.images[2].url}
							onPress={() => {
								this.props.navigation.navigate('Playlist', {
									type: 'artist',
									id: this.state.artistOfTheMonth.id
								});
							}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
								text={I18n.t('profile.artistOfTheMonth')}
								name={this.state.artistOfTheMonth.name}
								image={this.state.artistOfTheMonth.images[2].url}
								onPress={() => {
									this.props.navigation.navigate('Playlist', {
										type: 'artist',
										id: this.state.artistOfTheMonth.id
									});
								}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
							text={I18n.t('profile.artistOfTheMonth')}
							name={this.state.artistOfTheMonth.name}
							image={this.state.artistOfTheMonth.images[2].url}
							onPress={() => {
								this.props.navigation.navigate('Playlist', {
									type: 'artist',
									id: this.state.artistOfTheMonth.id
								});
							}} />
						<Preview
							text={I18n.t('profile.latestFavoriteSong')}
							name={this.state.mostPlayedTrack.name}
							image={this.state.mostPlayedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.mostPlayedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.mostPlayedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}}/>
						<Preview
							text={I18n.t('profile.latestDiscovery')}
							name={this.state.lastSavedTrack.name}
							image={this.state.lastSavedTrack.album.images[1].url}
							onPress={() => Spotify.play({
								trackUri: this.state.lastSavedTrack.uri
							})}
							onLongPress={() => {
								Spotify.pause();
								Spotify.playPreview(this.state.lastSavedTrack.id);
							}}
							onPressOut={() => {
								Spotify.stopPreview();
								Spotify.play();
							}} />
						<Preview
								text={I18n.t('profile.artistOfTheMonth')}
								name={this.state.artistOfTheMonth.name}
								image={this.state.artistOfTheMonth.images[2].url}
								onPress={() => {
									this.props.navigation.navigate('Playlist', {
										type: 'artist',
										id: this.state.artistOfTheMonth.id
									});
								}} />
						<Button
							title='Importer mes playlists'
							onPress={this.fetchPlaylists} />
					</ScrollView>
				}
			</View>
		);
	}
}

export default TestScrollView;

const styles = StyleSheet.create({
	grid: {
		// flex: 1,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		backgroundColor: '#223'
	}
});
