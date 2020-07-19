import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { Linking } from 'expo';
import * as WebBrowser from 'expo-web-browser';

import Fire from '../../utils/firebase';

const local = false;

const LinkScreen = () => (
	<View style={styles.container}>
		<Button
			onPress={() => WebBrowser.openBrowserAsync(
				local ? `http://localhost:8888/login?appUrl=https://localhost:19006&uid=${Fire.shared.uid}`
					: `SERVER_URL/login?appUrl=${Linking.makeUrl()}&uid=${Fire.shared.uid}`
			)}
			title="Lier mon compte Spotify"
			color="#61DBFB" />
	</View>
);

export default LinkScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111111',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
