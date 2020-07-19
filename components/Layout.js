import React from 'react';
import { View, StatusBar, StyleSheet } from 'react-native';

const Layout = ({ children, style }) => (
	<>
		<StatusBar
			translucent
			backgroundColor='#222'
			barStyle='light-content'
		/>
		<View style={[styles.container, style]}>
			{children}
		</View>
	</>
);

export default Layout;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#222',
		justifyContent: 'flex-start',
		alignItems: 'center',
	}
})
