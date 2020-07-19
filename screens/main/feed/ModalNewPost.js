import React from 'react';
import { Text, TextInput, StyleSheet } from 'react-native';

import ModalFullHeight from '../../../components/ModalFullHeight';
import Button from '../../../components/Button';

import Fire from '../../../utils/firebase';
import I18n from '../../../utils/i18n';

class ModalNewPost extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			currentText: "",
			results: []
		};
		this.onChangeTextHandler = this.onChangeTextHandler.bind(this);
		this.post = this.post.bind(this);
	}

	async onChangeTextHandler(currentText) {
		if (currentText.includes('@')) {
			// const search = currentText.split('@')[1];
			const search = currentText.match(/@[A-Za-z_0-9]+/)[0].slice(1);
			const usersFound = await Fire.shared.searchUsers(search);
			this.setState({
				results: usersFound || [],
				currentText: currentText
			});
		}
		else {
			this.setState({
				results: [],
				currentText: currentText
			});
		}
	}

	post() {
		if (this.state.currentText) {
			Fire.shared.addPost({ text: this.state.currentText });
			this.setState({ currentText: "" });
			this.props.close();
		}
	}

	render() {
		const { isVisible, close } = this.props;
		console.log(this.state)
		return (
			<ModalFullHeight
				isVisible={isVisible}
				onReturnPress={close}
			>
				<TextInput
					multiline
					numberOfLines={3}
					maxLength={420}
					placeholderTextColor='lightgrey'
					style={styles.input}
					onChangeText={this.onChangeTextHandler}
					placeholder={I18n.t('feed.postPlaceholder')} />
				<Button style={{ alignSelf: 'center' }} title={I18n.t('feed.sendPost')} onPress={this.post} />
				{this.state.results.map(e => (
					<Text key={e.id} style={{ color: 'white'}}>
						@{e.username}
					</Text>
				))}
			</ModalFullHeight>
		);
	}
}

export default ModalNewPost;

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
