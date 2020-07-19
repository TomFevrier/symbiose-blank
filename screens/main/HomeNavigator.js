import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import FeedScreen from './FeedScreen';
import ProfileNavigator from './ProfileNavigator';
import PlaylistScreen from './PlaylistScreen';

const Stack = createStackNavigator();

const HomeScreen = (props) => (
	<Stack.Navigator initialRouteName='Feed' headerMode='none'>
		<Stack.Screen name='Feed' component={FeedScreen} />
		<Stack.Screen name='Profile' component={ProfileNavigator} />
		<Stack.Screen name='Playlist' component={PlaylistScreen} />
	</Stack.Navigator>
);

export default HomeScreen;
