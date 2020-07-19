import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';

import Layout from '../../components/Layout';

import I18n from '../../utils/i18n';
import Fire from '../../utils/firebase';

class ResetPasswordScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			newPassword: "",
		};
		this.resetPassword = this.resetPassword.bind(this);
	}

	resetPassword() {
		Fire.shared.auth.verifyPasswordResetCode(this.props.actionCode)
		.then(async (email) => {
			await Fire.shared.auth.confirmPasswordReset(this.props.actionCode, this.state.newPassword);
			await Fire.shared.auth.signInWithEmailAndPassword(email, this.state.newPassword);
			this.props.clearMode();
		});
	}

	render() {
		return (
			<Layout>
				<Text style={styles.title}>Symbiose</Text>
				<TextInput
					style={styles.input}
					onChangeText={(newPassword) => this.setState({ newPassword })}
					placeholder="********"
					secureTextEntry />
				<Button
					onPress={this.resetPassword}
					color="#222"
					title={I18n.t('auth.logIn')} />
			</Layout>
		);
	}
}

export default ResetPasswordScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111111',
		alignItems: 'center',
		justifyContent: 'center'
	},
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
