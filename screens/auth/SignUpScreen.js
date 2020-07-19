import React, { Component } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

import Layout from '../../components/Layout';
import Button from '../../components/Button';

import I18n from '../../utils/i18n';
import Fire from '../../utils/firebase';

class SignUpScreen extends Component {

	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			lastName: "",
			username: "",
			email: "",
			password: ""
		};
		this.signup = this.signup.bind(this);
	}

	signup() {
		Fire.shared.auth.createUserWithEmailAndPassword(this.state.email, this.state.password)
		.then(() => {
			const user = Fire.shared.auth.currentUser;
			user.updateProfile({
				displayName: `${this.state.firstName} ${this.state.lastName}`
			});
			Fire.shared.addUser(this.state);
			user.sendEmailVerification();
		});
	}

	render() {
		return (
			<Layout style={{ justifyContent: 'center' }}>
				<Text style={styles.title}>Symbiose</Text>
				<View style={styles.form}>
					<TextInput
						style={styles.input}
						placeholderTextColor='lightgrey'
						onChangeText={(lastName) => this.setState({ lastName })}
						placeholder={I18n.t('auth.lastName')} />
					<TextInput
						style={styles.input}
						placeholderTextColor='lightgrey'
						onChangeText={(firstName) => this.setState({ firstName })}
						placeholder={I18n.t('auth.firstName')} />
					<TextInput
						style={styles.input}
						placeholderTextColor='lightgrey'
						onChangeText={(username) => this.setState({ username })}
						placeholder={I18n.t('auth.username')} />
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
					onPress={this.signup}
					color='white'
					backgroundColor='#222'
					title={I18n.t('auth.signUp')} />
				<Button
					onPress={() => this.props.navigation.navigate("Login")}
					color='white'
					backgroundColor='transparent'
					style={{ margin: 10 }}
					title={I18n.t('auth.alreadyAccount')} />
			</Layout>
		);
	}
}

export default SignUpScreen;

const styles = StyleSheet.create({
	title: {
		color: '#61DBFB',
		fontSize: 25,
		marginBottom: 15,
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
