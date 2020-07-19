import React from 'react';
import { TouchableHighlight, View, Image, Text, StyleSheet } from 'react-native';

import Spotify from '../utils/spotify';

import globalStyles from '../globalStyles';

const UserPreview = ({ navigation, user, separator }) => (
	<TouchableHighlight
		onPress={() => navigation.navigate('Profile', {
			uid: user.id
		})}
	>
		<View style={[styles.container, separator && {
			borderTopColor: 'white',
			borderTopWidth: 1,
		}]}>
			<Image
				source={user.profileImage ?
					{ uri: user.profileImage } :
					require('../assets/mamy.png')
				}
				style={styles.profileImage} />
			<Text style={globalStyles.text}>@{user.username}</Text>
		</View>
	</TouchableHighlight>
);

export default UserPreview;

const styles = StyleSheet.create({
	container: {
		height: 75,
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 10
	},
	profileImage: {
		width: 42,
		aspectRatio: 1,
		borderRadius: 21,
		marginRight: 10
	}
});
