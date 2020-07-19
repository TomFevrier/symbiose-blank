import React from 'react';

import { createStackNavigator } from '@react-navigation/stack';

import SearchScreen from './SearchScreen';
import ProfileNavigator from './ProfileNavigator';

const Stack = createStackNavigator();

const HomeScreen = (props) => (
	<Stack.Navigator initialRouteName='Search' headerMode='none'>
		<Stack.Screen name='Search' component={SearchScreen} />
		<Stack.Screen name='Profile' component={ProfileNavigator} />
	</Stack.Navigator>
);

export default HomeScreen;
