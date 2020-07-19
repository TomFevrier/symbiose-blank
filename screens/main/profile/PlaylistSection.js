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

import Preview from '../../../components/Preview';
import PreviewTrack from '../../../components/PreviewTrack';
import PreviewPlaylist from '../../../components/PreviewPlaylist';
import Button from '../../../components/Button';
import ModalFullHeight from '../../../components/ModalFullHeight';

import Fire from '../../../utils/firebase';
import Spotify from '../../../utils/spotify';
import I18n from '../../../utils/i18n';

class PlaylistSection extends React.Component {
	constructor(props) {
		super(props)
		this.state= {
			loading: true,
			playlists: [],
			playlistsToImport: [],
			playlistImportationModalVisible: false
		};
		this.refresh = this.refresh.bind(this);
		this.fetchPlaylists = this.fetchPlaylists.bind(this);
		this.selectPlaylist = this.selectPlaylist.bind(this);
		this.importSpotifyPlaylists = this.importSpotifyPlaylists.bind(this);
	}

	componentDidMount() {
		this.refresh();
	}

	// componentDidUpdate() {
	// 	this.refresh();
	// }

	async refresh() {
		const pinnedData = await Fire.shared.getPinnedData(this.props.uid);
		if (Object.values(pinnedData).filter(e => !e).length > 0) return;

		const playlists = await Fire.shared.getPlaylists(this.props.uid);

		const artistOfTheMonth = await Spotify.get(`/artists/${pinnedData.artistOfTheMonth}`);
		const lastSavedTrack = await Spotify.get(`/tracks/${pinnedData.lastSavedTrack}`);
		const mostPlayedTrack = await Spotify.get(`/tracks/${pinnedData.mostPlayedTrack}`);

		await this.setState({
			playlists,
			artistOfTheMonth,
			lastSavedTrack,
			mostPlayedTrack
		});

		this.setState({ loading: false });
	}

	async fetchPlaylists() {
		const playlists = (await Spotify.get('/me/playlists')).items;
		this.setState({
			playlistsToImport: playlists,
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

	async importSpotifyPlaylists() {
		this.setState({
			playlistImportationModalVisible: false
		});
		await this.state.playlistsToImport
			.filter((e, i) => {
				return this.state.playlistsSelected.indexOf(i) >= 0;
			})
			.forEach(async ({ name, id }) => {
				const playlist = await Spotify.get(`/playlists/${id}/tracks`);
				const pictures = [...new Set(playlist.items.map(e => e.track.album.images[0].url))].slice(0, 4);
				await Fire.shared.addPlaylist(
					name,
					id,
					pictures,
					playlist.items.map(e => e.track.id)
				);
			});
		this.refresh();
	}

	render() {
		return(
			<View style={{ flex: 1, backgroundColor: '#223' }}>
				{this.props.uid === Fire.shared.uid &&
					<ModalFullHeight
						isVisible={this.state.playlistImportationModalVisible}
						onReturnPress={() => this.setState({
							playlistImportationModalVisible: false
						})}
					>
						<View style={styles.grid}>
							{this.state.playlistsToImport.map((e, i) =>
								<PreviewPlaylist
									{...this.props}
									key={e.id}
									name={e.name}
									image={e.images[0].url}
									onPress={() => {
										if (!this.state.playlists.find(p => p.spotifyId === e.id))
											this.selectPlaylist(i);
									}}
									style={this.state.playlists.find(p => p.spotifyId === e.id) && { opacity: 0.5 }}/>
							)}
							<Button
								title='Importer'
								onPress={this.importSpotifyPlaylists} />
						</View>
					</ModalFullHeight>
				}
				{this.state.loading ?
					<ActivityIndicator
						style={{ position: 'absolute', alignSelf: 'center' }}
						size='large' color='#61DBFB' /> :
					<ScrollView contentContainerStyle={[
						styles.grid,
						{ justifyContent: this.state.loading ? 'center' : 'flex-start' }
					]}>
						<PreviewTrack
							text={I18n.t('profile.latestFavoriteSong')}
							track={this.state.mostPlayedTrack} />
						<PreviewTrack
							text={I18n.t('profile.latestDiscovery')}
							track={this.state.lastSavedTrack} />
						<Preview
							text={I18n.t('profile.artistOfTheMonth')}
							track={this.state.artistOfTheMonth.name}
							image={this.state.artistOfTheMonth.images[2].url}
							onPress={() => {
								this.props.navigation.navigate('SpotifyPlaylist', {
									type: 'artist',
									id: this.state.artistOfTheMonth.id
								});
							}} />
						{this.state.playlists.map(e =>
							<PreviewPlaylist
								{...this.props}
								key={e.id}
								id={e.id}
								name={e.name}
								tracks={e.tracks}
								pictures={e.pictures} />
						)}
						{this.props.uid === Fire.shared.uid &&
							<Button
								title='Importer mes playlists'
								onPress={this.fetchPlaylists} />
						}
					</ScrollView>
				}
			</View>
		);
	}
}

export default PlaylistSection;

const styles = StyleSheet.create({
	grid: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	}
});
