import React from 'react';
import { View, Text, TextInput, TouchableHighlight, StyleSheet } from 'react-native';
import Modal from 'react-native-modal';
import { FloatingAction } from 'react-native-floating-action';

import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Feed from '../../components/Feed';
import ModalNewPost from './feed/ModalNewPost';
import ModalNewMusicalPost from './feed/ModalNewMusicalPost';

import I18n from '../../utils/i18n';

class FeedScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			newPostVisible: false,
			newMusicalPostVisible: false
		}
	}

	render() {
		const actions = [
		  {
		    name: 'Add musical post',
		    position: 2,
			color: '#222',
			icon: <MaterialCommunityIcons name='library-video' size={20} color='white' />

		  },
		  {
		    name: 'Add text post',
		    position: 1,
			color: '#222',
			icon: <MaterialCommunityIcons name='text-subject' size={23} color='white' />

		  },
		];
		return (
			<Layout>
				<ModalNewPost
					isVisible={this.state.newPostVisible}
					close={() => this.setState({
						newPostVisible: false
					})} />
				<ModalNewMusicalPost
					isVisible={this.state.newMusicalPostVisible}
					close={() => this.setState({
						newMusicalPostVisible: false
					})} />
				<Feed navigation={this.props.navigation} />
				<FloatingAction
					color='#61DBFB'
					iconColor='black'
					actions={actions}
					onPressItem={name => {
						switch(name) {
							case 'Add text post':
								this.setState({ newPostVisible: true });
								break;
							case 'Add musical post':
								this.setState({ newMusicalPostVisible: true });
								break;
						}
					}} />
			</Layout>
		);
	}
}

export default FeedScreen;
