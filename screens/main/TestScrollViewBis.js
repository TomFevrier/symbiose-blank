import React from 'react';

import {
	View,
	ScrollView,
	Text,
	Image,
	ActivityIndicator,
	TouchableHighlight,
	StyleSheet
} from 'react-native';

import Preview from '../../components/Preview';
import Button from '../../components/Button';
import ModalFullHeight from '../../components/ModalFullHeight';

import Fire from '../../utils/firebase';
import Spotify from '../../utils/spotify';
import I18n from '../../utils/i18n';

class TestScrollView extends React.Component {
	constructor(props) {
		super(props)
	}


	render() {
		return(
			<ScrollView>
				{new Array(100).fill(0).map(e =>
					<Text>Salope</Text>
				)}
			</ScrollView>
		);
	}
}

export default TestScrollView;

const styles = StyleSheet.create({
	grid: {
		flex: 1,
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		flexWrap: 'wrap',
		backgroundColor: '#223'
	}
});
