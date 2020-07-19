import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

import ModalNewMusicalPost from '../feed/ModalNewMusicalPost'
import Track from '../../../components/Track';
import Button from '../../../components/Button';

import Spotify from '../../../utils/spotify';

class MusicResults extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			trackToShare: null,
			shareVisible: false
		};
	}

	render() {
		console.log(this.state)
		return (
			<View style={styles.container}>
				<ModalNewMusicalPost
					isVisible={this.state.shareVisible}
					close={() => this.setState({
						shareVisible: false
					})}
					track={this.state.trackToShare} />
				<FlatList
					data={this.props.results}
					renderItem={({ item, index }) => (
						<View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
							<Track
								key={item.id}
								track={item}
								separator={index > 0} />
							<Button
								title='Share'
								onPress={() => {
									this.setState({
										shareVisible: true,
										trackToShare: item
									});
								}}/>
						</View>
					)}
					keyExtractor={e => e.id} />
			</View>
		);
	}
}

export default MusicResults;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#333',
		flex: 1,
		alignItems: 'center',
		paddingVertical: 20
	}
})
