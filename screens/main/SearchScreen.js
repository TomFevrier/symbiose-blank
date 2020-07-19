import React from 'react';
import { View, Text, TextInput, StyleSheet, FlatList} from 'react-native';

import { Container, Tabs, Tab, TabHeading } from 'native-base';

import { Ionicons } from '@expo/vector-icons';

import Layout from '../../components/Layout';

import Button from '../../components/Button';
import UserResults from './search/UserResults';
import MusicResults from './search/MusicResults';

import I18n from '../../utils/i18n';
import Fire from '../../utils/firebase';
import Spotify from '../../utils/spotify';

import globalStyles from '../../globalStyles';

class SearchScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			search: "",
			usersFound: [],
			tracksFound: []
		};
		this.updateSearch = this.updateSearch.bind(this);
	}

	componentDidMount() {
		this.unsubscribe = this.props.navigation.addListener('focus', () => {
			this.setState({
				search: "",
				usersFound: [],
				tracksFound: []
			});
			this.searchBar.clear();
		})
	}

	componentWillUnmount(){
		this.unsubscribe();
	}

	async updateSearch(text) {
		const usersFound = await Fire.shared.searchUsers(text);
		const spotifyResults = (await Spotify.get(`/search?q=${text.replace(/\s/g, '%20')}&type=track`)).tracks.items;
		this.setState({
			search: text,
			usersFound: usersFound || [],
			tracksFound: spotifyResults || []
		});
	}

	render() {
		return (
			<Layout>
				<TextInput
					style={styles.input}
					placeholderTextColor='lightgrey'
					placeholder={I18n.t('search')}
					onChangeText={this.updateSearch}
					ref={input => this.searchBar = input} />
				<Container>
					<Tabs initialPage={0}>
						<Tab style={{ flex: 1 }} heading={
							<TabHeading style={{ backgroundColor: '#222' }}>
								<Ionicons name='ios-musical-notes' size={25} color='white' />
							</TabHeading>
						}>
							<MusicResults results={this.state.tracksFound} />
						</Tab>
						<Tab heading={
							<TabHeading style={{ backgroundColor: '#222' }}>
								<Ionicons name='md-person' size={25} color='white' />
							</TabHeading>
						}>
							<UserResults {...this.props} usersFound={this.state.usersFound} />
						</Tab>
					</Tabs>
				</Container>
			</Layout>
		);
	}
}

export default SearchScreen;

const styles = StyleSheet.create({
	input: {
		color: 'white',
		padding: 4,
		borderBottomColor: '#61DBFB',
		borderBottomWidth: 1,
		margin: 25,
		textAlignVertical: 'top'
	}
});
