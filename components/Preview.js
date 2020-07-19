import React from 'react';
import { TouchableOpacity, View, Text, Image, StyleSheet } from 'react-native';

import ModalBottom from './ModalBottom';

class Preview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			modalVisible: false
		};
	}

	render() {
		return (
			<View style={[styles.container, this.props.style]}>
				<ModalBottom>
					<Text>SUPER MODAL</Text>
				</ModalBottom>
				<TouchableOpacity onPress={this.props.onPress} onLongPress={this.props.onLongPress} onPressOut={this.props.onPressOut}>
					{this.props.image &&
						<Image style={styles.image} source={{ uri: this.props.image }} resizeMode='contain' />
					}
					{this.props.images && this.props.images.length < 4 &&
						<Image style={styles.image} source={{ uri: this.props.images[0] }} resizeMode='contain' />
					}
					{this.props.images && this.props.images.length === 4 &&
						<View style={styles.grid}>
							{this.props.images.map(e =>
								<Image key={e} style={styles.imageSmall} source={{ uri: e }} resizeMode='contain' />
							)}
						</View>
					}
					<View style={styles.textContainer}>
						<Text style={[styles.text, { fontSize: 20, fontWeight: 'bold' }]}>{this.props.text}</Text>
						<Text style={styles.text}>{this.props.name}</Text>
					</View>
				</TouchableOpacity>
			</View>
		);
	}
}

export default Preview;

const styles = StyleSheet.create({
	container: {
		width: '33.33%',
		position: 'relative'
	},
	image: {
		width: '100%',
		aspectRatio: 1
	},
	grid: {
		justifyContent: 'flex-start',
		alignItems: 'flex-start',
		width: '100%',
		aspectRatio: 1,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	imageSmall: {
		width: '50%',
		aspectRatio: 1
	},
	textContainer: {
		position: 'absolute',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		aspectRatio: 1,
		backgroundColor: '#61DBFB66'
	},
	text: {
		fontFamily: 'Roboto',
		color: 'white',
		textAlign: 'center'
	}
});
