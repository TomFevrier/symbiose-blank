import React from 'react';
import { View, TouchableHighlight, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Button from '../../../components/Button';

import I18n from '../../../utils/i18n';
import Fire from '../../../utils/firebase';
import Spotify from '../../../utils/spotify';

import globalStyles from '../../../globalStyles';

const InfoSection = (props) => (
	<View style={{ justifyContent: 'flex-start', width: '100%' }}>
		{!props.isProfile  &&
			<View style={styles.header}>
				<TouchableHighlight
					style={styles.button}
					onPress={() => props.navigation.goBack()}
				>
					<Ionicons
						name='ios-arrow-back' size={25}
						color='white' />
				</TouchableHighlight>
			</View>
		}
		<View style={styles.section}>
			<View style={styles.profilePic}>
				<Image
					source={ props.profileImage ? { uri: props.profileImage } : require('../../../assets/mamy.png') }
					style={{
						width: 100,
						height: 100,
						borderRadius: 50
					}} />
			</View>
			<View style={styles.info}>
				<Text style={globalStyles.text}>
					{props.firstName} {props.lastName}
				</Text>
				<Text style={globalStyles.text}>
					@{props.username}
				</Text>
				<Text style={globalStyles.text}>
					{props.nbPosts} {I18n.t('profile.post', { count: props.nbPosts })} | {props.followerCount} {I18n.t('profile.follower', { count: props.followerCount })} | {props.followeeCount} {I18n.t('profile.followee', { count: props.followeeCount })}
				</Text>
				{props.currentlyPlaying.name &&
					<Text style={globalStyles.text}>
						🎧 {props.currentlyPlaying.name} ({props.currentlyPlaying.artists[0].name}) 🎧
					</Text>
				}
				{props.uid === Fire.shared.uid ?
					<Button
						title={I18n.t('profile.logOut')}
						style={{ width: 150, alignSelf: 'center', margin: 10 }}
						onPress={async () => {
							await Spotify.unsubscribePlayer();
							Fire.shared.auth.signOut();
						}} /> :
					<Button
						title={props.isFollowing ? I18n.t('profile.unfollow') : I18n.t('profile.follow')}
						style={{ width: 150, alignSelf: 'center', margin: 10 }}
						onPress={props.onFollowPress} />
				}
			</View>
		</View>
	</View>
);

export default InfoSection;

const styles = StyleSheet.create({
	header: {
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
	section: {
		marginVertical: 20,
		alignItems: 'flex-start',
		flexDirection: 'row'
	},
	profilePic: {
		flex: 1,
		justifyContent: 'flex-start',
		alignItems: 'center'
	},
	info: {
		flex: 2,
		justifyContent: 'flex-start',
	}
});
