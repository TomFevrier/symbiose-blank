import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableWithoutFeedback, TouchableHighlight, StyleSheet } from 'react-native';

import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';

import ModalBottom from './ModalBottom';
import ModalFullHeight from './ModalFullHeight';
import Track from './Track';
import PreviewPlaylist from './PreviewPlaylist';

import moment from 'moment/moment';
require('moment/locale/fr');

import I18n from '../utils/i18n';
import Fire from '../utils/firebase';

import globalStyles from '../globalStyles';

moment.locale(I18n.locale);

const OptionsModal = (props) => {
	const { isUserPost, deletePost } = props;
	return (
		<ModalBottom
			isVisible={props.isVisible}
			onBackdropPress={props.onBackdropPress}
		>
			<Text style={globalStyles.text}>Hello world!</Text>
			{isUserPost && (
				<TouchableHighlight onPress={deletePost}>
					<Text style={globalStyles.text}>{I18n.t('delete')}</Text>
				</TouchableHighlight>
			)}
		</ModalBottom>
	);
};

const ListModal = (props) => {
	const { content, contentType } = props;
	const [users, setUsers] = useState([]);
	useEffect(() => {
		(async () => {
			const promises = content.map(async uid => await Fire.shared.getUser(uid));
			setUsers((await Promise.all(promises)));
		})();
	}, [content]);
	return (
		<ModalFullHeight
			isVisible={props.isVisible}
			onReturnPress={props.onReturnPress}
		>
			<View style={{
				alignItems: 'center',
				width: '100%'
			}}>
				<Text style={[globalStyles.text, {
					fontSize: 20,
					fontFamily: 'Roboto',
					fontWeight: 'bold',
					textAlign: 'center',
					marginVertical: 10
				}]}>
					{I18n.t(contentType === 'reposts' ?
						'feed.repostedBy' :
						'feed.likedBy'
					)}
				</Text>
				{users.map(e =>
					<Text
						key={e.id}
						style={globalStyles.text}
					>
						@{e.username}
					</Text>
				)}
				{users.length === 0 &&
					<Text style={globalStyles.text}>
						:'(
					</Text>
				}
			</View>
		</ModalFullHeight>
	);
};

class Post extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			optionsVisible: false,
			listVisible: false,
			isReposted: props.post.isReposted,
			nbReposts: props.post.reposts.length,
			isLiked: props.post.isLiked,
			nbLikes: props.post.likes.length
		};
		this.onPressRepost = this.onPressRepost.bind(this);
		this.onPressLike = this.onPressLike.bind(this);
	}

	shouldComponentUpdate(nextProps, nextState) {
		return nextState !== this.state;
	}

	onPressRepost() {
		let nbReposts = this.state.nbReposts;
		if (!this.state.isReposted) {
			Fire.shared.repost(this.props.post);
			nbReposts++;
		}
		else {
			Fire.shared.unRepost(this.props.post);
			nbReposts--;
		}
		this.setState({
			isReposted: !this.state.isReposted,
			nbReposts: nbReposts
		});
	}

	onPressLike() {
		let nbLikes = this.state.nbLikes;
		console.log(this.state.isLiked, this.state.nbLikes)
		if (!this.state.isLiked) {
			Fire.shared.like(this.props.post);
			nbLikes++;
		}
		else {
			Fire.shared.unLike(this.props.post);
			nbLikes--;
		}
		this.setState({
			isLiked: !this.state.isLiked,
			nbLikes: nbLikes
		});
	}

	render() {
		 const { post, onUsernamePress, isUserPost } = this.props;
		 return (
			 <View style={styles.container}>
			 	<OptionsModal
					isVisible={this.state.optionsVisible}
					onBackdropPress={() => this.setState({ optionsVisible: false })}
					isUserPost={isUserPost}
					deletePost={async () => {
						await this.setState({ optionsVisible: false });
						Fire.shared.deletePost(post);
					}} />
				<ListModal
					isVisible={this.state.listVisible}
					onReturnPress={() => this.setState({ listVisible: false })}
					contentType={this.state.listContentType}
					content={
						this.state.listContentType === 'reposts' ?
						this.props.post.reposts :
						this.props.post.likes
					}
					/>
				{post.reposter &&
					<Text style={{
						color: 'lightgrey',
						paddingBottom: 10
					}}>
						{post.reposter.username} {I18n.t('feed.reposted')}:
					</Text>
				}
		 		<View style={styles.header}>
					<TouchableWithoutFeedback onPress={onUsernamePress}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Image
								source={post.profileImage ?
									{ uri: post.profileImage } :
									require('../assets/mamy.png')
								}
								style={styles.profileImage} />
							<Text style={{ color: 'lightgrey' }}>@{post.username}</Text>
						</View>
					</TouchableWithoutFeedback>
					<View style={{ flexDirection: 'row', alignItems: 'center' }}>
		 				<Text style={{ color: 'lightgrey' }}>{moment(post.timestamp).fromNow()}</Text>
						<MaterialCommunityIcons
							name='dots-vertical' size={24} color='white'
							onPress={() => this.setState({ optionsVisible: true })} />
					</View>
		 		</View>
		 		<View style={styles.content}>
		 			<Text style={globalStyles.text}>{post.text}</Text>
					{post.track && <Track track={post.track} />}
					{post.playlist && (
						<PreviewPlaylist
							{...this.props}
							name={post.playlist.name}
							tracks={post.playlist.tracks}
							pictures={post.playlist.pictures} />
					)}
		 		</View>
		 		<View style={styles.buttons}>
					<TouchableHighlight onPress={this.onPressRepost}>
						<MaterialCommunityIcons
							style={styles.icon}
							name='key' size={20}
							color={this.state.isReposted ? '#61DBFB' : 'white'} />
					</TouchableHighlight>
					<TouchableWithoutFeedback
						onPress={() => this.setState({
							listVisible: true,
							listContentType: 'reposts'
						})}>
						<Text style={globalStyles.text}>
							{this.state.nbReposts + ' '.repeat(10)}
						</Text>
					</TouchableWithoutFeedback>
					<TouchableHighlight onPress={this.onPressLike}>
		 				<Ionicons
							style={styles.icon}
							name='ios-musical-notes' size={24}
							color={this.state.isLiked ? '#61DBFB' : 'white'} />
					</TouchableHighlight>
					<TouchableWithoutFeedback
						onPress={() => this.setState({
							listVisible: true,
							listContentType: 'likes'
						})}>
						<Text style={globalStyles.text}>
							{this.state.nbLikes + ' '.repeat(10)}
						</Text>
					</TouchableWithoutFeedback>
		 			<MaterialCommunityIcons style={styles.icon} name='comment' size={20} color='white' />
					<Text style={globalStyles.text}>0   </Text>
		 		</View>
			</View>
		);
	}
}

export default Post;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#333333',
		borderRadius: 5,
		padding: 8,
		marginVertical: 8
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	profileImage: {
		width: 42,
		aspectRatio: 1,
		borderRadius: 21,
		marginRight: 10
	},
	content: {
		marginVertical: 10
	},
	buttons: {
		flexDirection: 'row'
	},
	icon: {
		marginHorizontal: 5
	}
});
