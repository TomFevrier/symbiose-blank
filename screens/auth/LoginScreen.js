import React, { Component } from 'react';
import { View, Text, TextInput, Alert, StyleSheet } from 'react-native';

import Layout from '../../components/Layout';
import Button from '../../components/Button';

import I18n from '../../utils/i18n';
import Fire from '../../utils/firebase';

class LoginScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			email: "",
			password: ""
		};
		this.login = this.login.bind(this);
	}

	async login() {
		try {
			let email;
			if (!this.state.email.includes('@')) {
				email = await Fire.shared.getEmail(this.state.email);
				if (!email) return;
			}
			else
				email = this.state.email;
			await Fire.shared.auth.setPersistence(Fire.shared.localPersistence);
			await Fire.shared.auth.signInWithEmailAndPassword(email, this.state.password);
			// this.props.navigation.navigate("Link");
		}
		catch (error) {
			Alert.alert("Oups", "Adresse mail ou mot de passe invalide");
		}

	}

	render() {
		return (
			<Layout style={{ justifyContent: 'center' }}>
				<Text style={styles.title}>Symbiose</Text>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						placeholderTextColor='lightgrey'
						onChangeText={(email) => this.setState({ email })}
						placeholder="exemple@exemple.com" />
					<TextInput
						style={styles.input}
						placeholderTextColor='lightgrey'
						onChangeText={(password) => this.setState({ password })}
						placeholder="********"
						secureTextEntry />
				</View>
				<Button
					onPress={this.login}
					color='white'
					backgroundColor='#222'
					title={I18n.t('auth.logIn')} />
				<Button
					onPress={() => this.props.navigation.goBack()}
					color='white'
					backgroundColor='transparent'
					title={I18n.t('auth.signUp')} />
				<Button
					onPress={() => this.props.navigation.navigate('ForgottenPassword')}
					color='white'
					backgroundColor='transparent'
					title={I18n.t('auth.forgotPassword')} />
			</Layout>
		);
	}
}

export default LoginScreen;

const styles = StyleSheet.create({
	title: {
		color: '#61DBFB',
		fontSize: 25,
		textTransform: 'uppercase'
	},
	form: {
		alignItems: 'stretch'
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
