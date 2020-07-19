import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

import Layout from '../../components/Layout';

import I18n from '../../utils/i18n';
import Fire from '../../utils/firebase';

class ForgottenPasswordScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
		};
	}

	render() {
		return (
			<Layout>
				<Text style={styles.title}>Symbiose</Text>
				<TextInput
					style={styles.input}
					onChangeText={(email) => this.setState({ email })}
					placeholder="exemple@exemple.com" />
				<Button
					onPress={() => Fire.shared.auth.sendPasswordResetEmail(this.state.email)}
					color="#222"
					title={I18n.t('confirm')} />
			</Layout>
		);
	}
}

export default ForgottenPasswordScreen;

const styles = StyleSheet.create({
	title: {
		color: '#61DBFB',
		fontSize: 25,
		textTransform: 'uppercase'
	},
	input: {
		color: 'white',
		padding: 4,
		borderBottomColor: '#61DBFB',
		shadowColor: "#61DBFB",
		shadowOffset: {
			width: 0,
			height: 0.5,
		},
		shadowOpacity: 0.2,
		shadowRadius: 1,
		elevation: 14,
		borderBottomWidth: 1,
		margin: 25
	}
});
