import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { YellowBox } from 'react-native';
import { Linking } from 'expo';

import LoginScreen from './screens/auth/LoginScreen';
import SignUpScreen from './screens/auth/SignUpScreen';
import ForgottenPasswordScreen from './screens/auth/ForgottenPasswordScreen';
import ResetPasswordScreen from './screens/auth/ResetPasswordScreen';
import LinkScreen from './screens/auth/LinkScreen';

import Main from './Main';

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack';

import Fire from './utils/firebase';

const Stack = createStackNavigator();

class App extends React.Component {

	constructor() {
		super();
		this.state = {
			mode: null,
			actionCode: null,
			accessToken: null,
			loading: true
		};
		this.urlHandler = this.urlHandler.bind(this);
		YellowBox.ignoreWarnings(['Setting a timer']);
		console.warn = message => {
			// if (message.indexOf('Setting a timer') < 0) {
			// 	console.warn(message);
			// }
		};
	}

	urlHandler(e) {
		this.setState({
			mode: Linking.parse(e.url).queryParams.mode,
			actionCode: Linking.parse(e.url).queryParams.oobCode
		});
	}

	componentDidMount() {
		Linking.addEventListener('url', this.urlHandler);
		Fire.shared.auth.onAuthStateChanged(user => {
			this.setState({ user });
			if (user) {
				this.unsubscribe = Fire.shared.firestore.collection('users').doc(user.uid)
					.onSnapshot(doc => {
						this.setState({
							accessToken: doc.data().accessToken
						});
					});
			}
			this.setState({ loading: false });
        });
	}

	componentDidUpdate() {
		if (this.state.mode == 'verifyEmail') {
			this.setState({ mode: null });
			Fire.shared.auth.applyActionCode(this.state.actionCode)
			.then((resp) => {
				console.log(resp)
			})
			.catch(e => console.log(e))
		}
	}

	componentWillUnmount() {
		Linking.removeEventListener('url', this.urlHandler);
		this.unsubscribe && this.unsubscribe();
	}

	render() {
		// Problème résolu : au lieu d'avoir un seul StackNavigator, on en a deux avec une ternaire
		// Le problème venait bien du fait que initialRouteName ne peut pas changer

		// Ligne 44 : pour passer des props à un screen on ne peut pas utiliser component,
		// on doit passer une fonction qui renvoie le composant avec ses props
		// Voir https://reactnavigation.org/docs/hello-react-navigation#passing-additional-props
		if (this.state.loading)
			return <ActivityIndicator size='large' color='#61DBFB' />
		else if (!this.state.user && this.state.mode == 'resetPassword') {
			return <ResetPasswordScreen actionCode={this.state.actionCode} clearMode={() => this.setState({ mode: null })} />
		}
		else if (!this.state.user) {
			return (
				<NavigationContainer>
					<Stack.Navigator initialRouteName='SignUp' headerMode='none'>
						<Stack.Screen name='SignUp' component={SignUpScreen} />
						<Stack.Screen name='Login' component={LoginScreen} />
						<Stack.Screen name='ForgottenPassword' component={ForgottenPasswordScreen} />
						<Stack.Screen name='ResetPassword' component={ResetPasswordScreen} />
					</Stack.Navigator>
				</NavigationContainer>
			);
		}
		else if (!this.state.accessToken) {
			return <LinkScreen />
		}
		else {
			return <Main />
		}
	}
}

export default App;
