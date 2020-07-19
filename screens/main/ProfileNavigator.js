import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import ProfileScreen from './ProfileScreen';
import PlaylistScreen from './PlaylistScreen';
import SpotifyPlaylistScreen from './SpotifyPlaylistScreen';

const Stack = createStackNavigator();

const ProfileNavigator = (props) => (
	<Stack.Navigator initialRouteName='Profile' headerMode='none'>
		<Stack.Screen name='Profile' component={
			navigationProps => <ProfileScreen {...navigationProps} uid={props.route.params?.uid} />
		} />
		<Stack.Screen name='Playlist' component={PlaylistScreen} />
		<Stack.Screen name='SpotifyPlaylist' component={SpotifyPlaylistScreen} />
	</Stack.Navigator>
);

export default ProfileNavigator;
