import React from 'react';
import { View, TouchableHighlight, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

import { Ionicons } from '@expo/vector-icons';

const ModalFullHeight = ({ isVisible, onReturnPress, children }) => (
	<Modal
		transparent={true}
		isVisible={isVisible}
		style={{ margin: 0, height: '100%' }}
	>
		<View style={styles.container}>
			<View style={styles.header}>
				<TouchableHighlight
					style={styles.button}
					onPress={onReturnPress}
				>
					<Ionicons
						name='ios-arrow-back' size={25}
						color='white' />
				</TouchableHighlight>
			</View>
			{children}
		</View>
	</Modal>
);

export default ModalFullHeight;

const styles = StyleSheet.create({
	container: {
		justifyContent: 'flex-start',
		alignItems: 'stretch',
		marginBottom: 25,
		width: '100%',
		height: '100%',
		backgroundColor: '#222'
	},
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
	}
});
