import React from 'react';
import { View, Text, Image, TouchableOpacity, TouchableHighlight,  StyleSheet } from 'react-native';

import ModalBottom from './ModalBottom';

import I18n from '../utils/i18n';
import Fire from '../utils/firebase';

import globalStyles from '../globalStyles';

class PreviewPlaylist extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false
		};
	}

	render() {
		const {
			id,
			name,
			tracks,
			pictures,
			image,
			onPress,
			navigation,
			style
		} = this.props;
		return (
			<View style={[styles.container, style]}>
				<ModalBottom
					isVisible={this.state.modalVisible}
					onBackdropPress={() => this.setState({ modalVisible: false })}
				>
					<TouchableHighlight onPress={() => {
						Fire.shared.deletePlaylist(id);
						this.setState({ modalVisible: false });
					}}>
						<Text style={globalStyles.text}>{I18n.t('delete')}</Text>
					</TouchableHighlight>
				</ModalBottom>
				<TouchableOpacity
					onPress={onPress || (() => {
						navigation.navigate('Playlist', {
							name: name,
							tracks: tracks
						});
					})}
					onLongPress={!image && this.props.uid === Fire.shared.uid ?
						() => this.setState({ modalVisible: true }) :
						() => {}
					}
				>
					{image &&
						<Image
							style={styles.image}
							source={{ uri: image }}
							resizeMode='contain' />
					}
					{pictures && pictures.length < 4 &&
						<Image
							style={styles.image}
							source={{ uri: pictures[0] }}
							resizeMode='contain' />
					}
					{pictures && pictures.length === 4 &&
						<View style={styles.grid}>
							{pictures.map(e =>
								<Image
									key={e}
									style={styles.imageSmall}
									source={{ uri: e }}
									resizeMode='contain' />
							)}
						</View>
					}
					<View style={styles.textContainer}>
						{/*
						<Text style={[styles.text, { fontSize: 20, fontWeight: 'bold' }]}>{this.props.text}</Text>
						*/}
						<Text style={[styles.text, {
							fontSize: 20,
							fontWeight: 'bold'
						}]}>
							{name}
						</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

export default PreviewPlaylist;

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
