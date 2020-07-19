import React from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';

const ModalBottom = ({ isVisible, onBackdropPress, children }) => (
	<Modal
		transparent={true}
		isVisible={isVisible}
		onBackdropPress={onBackdropPress}
		style={{ margin: 0 }}
	>
		<View style={styles.container}>
			{children}
		</View>
	</Modal>
);

export default ModalBottom;

const styles = StyleSheet.create({
	container: {
		width: '100%',
		height: 100,
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '#424242',
		bottom: 0,
		padding: 10,
		position: 'absolute',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10
	}
});
