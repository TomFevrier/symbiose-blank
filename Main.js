import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'expo';

import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeNavigator from './screens/main/HomeNavigator';
import LinkScreen from './screens/auth/LinkScreen';
import SearchNavigator from './screens/main/SearchNavigator';
import SymbioseScreen from './screens/main/SymbioseScreen';
import NotificationScreen from './screens/main/NotificationScreen';
import ProfileNavigator from './screens/main/ProfileNavigator';

import Player from './components/Player';

import Spotify from './utils/spotify';
import Fire from './utils/firebase';

const Tabs = createBottomTabNavigator();

class Main extends React.Component {

	constructor() {
		super();
	}

	async componentDidMount() {
		const artistOfTheMonth = (await Spotify.get('/me/top/artists?time_range=short_term&limit=1')).items[0].id;

		const lastSavedTrack = (await Spotify.get('/me/tracks?limit=1')).items[0].track.id;

		const lastPlayedTracks = await Spotify.get('/me/player/recently-played?limit=50');

		const mostPlayedTrack = lastPlayedTracks.items.sort((a, b) => {
			return lastPlayedTracks.items.filter(e => e.track.id === b.track.id).length - lastPlayedTracks.items.filter(e => e.track.id === a.track.id).length;
		})[0].track.id;

		Spotify.subscribePlayer();

		Fire.shared.updateData({
			artistOfTheMonth: artistOfTheMonth,
			lastSavedTrack: lastSavedTrack,
			mostPlayedTrack: mostPlayedTrack
		});
	}

	render() {
		return (
			<>
				<Player />
				<NavigationContainer>
					<Tabs.Navigator
						initialRouteName='Home'
						tabBarOptions={{
							activeTintColor: '#61DBFB',
							inactiveTintColor: 'white',
							activeBackgroundColor: '#222222',
							inactiveBackgroundColor: '#111111',
							showLabel: false,
							keyboardHidesTabBar: true
						}}
						screenOptions={({ route }) => ({
							tabBarIcon: ({ color }) => {
								let iconName;
								switch(route.name) {
									case 'Home':
										iconName = 'md-home';
										break;
									case 'Search':
										iconName = 'md-search';
										break;
									case 'Symbiose':
										iconName = 'md-key';
										break;
									case 'Notifications':
										iconName = 'ios-musical-notes'
										break;
									case 'Profile':
										iconName = 'md-person'
										break;
								}
								return <Ionicons name={iconName} size={24} color={color} />
							}
						})}
					>
						<Tabs.Screen name='Home' component={HomeNavigator} />
						<Tabs.Screen name='Search' component={SearchNavigator} />
						<Tabs.Screen name='Symbiose' component={SymbioseScreen} />
						<Tabs.Screen name='Notifications' component={NotificationScreen} />
						<Tabs.Screen name='Profile' component={ProfileNavigator} />
					</Tabs.Navigator>
				</NavigationContainer>
			</>
		);
	}
}

export default Main;
