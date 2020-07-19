import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import ModalFullHeight from '../../../components/ModalFullHeight';
import Button from '../../../components/Button';
import PreviewTrack from '../../../components/PreviewTrack';
import PreviewPlaylist from '../../../components/PreviewPlaylist';

import Fire from '../../../utils/firebase';
import I18n from '../../../utils/i18n';

class ModalNewMusicalPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentText: "",
			playlists: [],
			playlistToShare: null,
			loading: true
		};
		this.post = this.post.bind(this);
	}

	post() {
		if (this.state.currentText) {
			const post = { text: this.state.currentText };
			if (this.props.track) {
				post.track = {
					id: this.props.track.id,
					uri: this.props.track.uri,
					name: this.props.track.name,
					image: this.props.track.album.images[0].url
				};
			}
			else if (this.state.playlistToShare) {
				post.playlist = {
					id: this.state.playlistToShare.id,
					name: this.state.playlistToShare.name,
					pictures: this.state.playlistToShare.pictures,
					tracks: this.state.playlistToShare.tracks
				};
			}
			Fire.shared.addPost(post);
			this.setState({ currentText: "" });
			this.props.close();
		}
	}

	async componentDidMount() {
		const playlists = await Fire.shared.getPlaylists(Fire.shared.uid);
		await this.setState({ playlists: playlists });
		this.setState({ loading: false });
	}

	render() {
		const { isVisible, close, track } = this.props;
		return (
			<ModalFullHeight
				isVisible={isVisible}
				onReturnPress={close}
			>
				<TextInput
					multiline
					numberOfLines={3}
					maxLength={420}
					placeholderTextColor='lightgrey'
					style={styles.input}
					onChangeText={(currentText) => this.setState({ currentText })}
					value={this.state.currentText}
					placeholder={I18n.t('feed.postPlaceholder')} />
				<Button style={{ alignSelf: 'center' }} title={I18n.t('feed.sendPost')} onPress={this.post} />
				{track && <PreviewTrack track={track} />}
				{!track && (
					<View style={styles.grid}>
						{this.state.playlists.map((e, i) =>
							<PreviewPlaylist
								key={e.id}
								name={e.name}
								pictures={e.pictures}
								style={{ opacity: e.id === this.state.playlistToShare?.id ? 0.3 : 1 }}
								onPress={() => {
									this.setState({
										playlistToShare: e
									});
								}} />
						)}
					</View>
				)}
			</ModalFullHeight>
		);
	}
}

export default ModalNewMusicalPost;

const styles = StyleSheet.create({
	input: {
		color: 'white',
		padding: 4,
		borderBottomColor: '#61DBFB',
		borderBottomWidth: 1,
		margin: 25,
		textAlignVertical: 'top'
	},
	grid: {
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap'
	}
});
