import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Button = (props) => {
	return (
		<TouchableOpacity style={{ justifyContent: 'center' }} onPress={props.onPress}>
			<View style={[styles.button, { backgroundColor: props.backgroundColor || '#61DBFB', ...props.style }]}>
				<Text style={{ color: props.color || 'black' }}>{props.title}</Text>
			</View>
		</TouchableOpacity>
	);
}

export default Button;

const styles = StyleSheet.create({
	button: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 8,
		borderRadius: 5
	}
});
