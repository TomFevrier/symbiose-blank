import React from 'react';
import { FlatList, RefreshControl, ActivityIndicator, StyleSheet } from 'react-native';

import Post from './Post';

import Fire from '../utils/firebase';

class Feed extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			posts: [],
			loading: false
		}
		this.cursor = null;
		this.endReached = false;
		this.nbPostsToLoad = 20;
		this.makeRequest = this.makeRequest.bind(this);
		this.subscribe = this.subscribe.bind(this);
	}

	async makeRequest() {
		if (this.state.loading || this.endReached) return;
		this.setState({ loading: true });

		const { cursor, posts } = await Fire.shared.getPagedPosts(this.cursor, this.nbPostsToLoad, this.props);
		if (cursor)
			this.cursor = cursor;
		else
			this.endReached = true;
		this.setState({
			posts: [...this.state.posts, ...posts]
		});

		this.setState({ loading: false });
	}

	async subscribe() {
		if (this.unsubscribe) this.unsubscribe();
		let query = Fire.shared.firestore.collection('posts').orderBy('timestamp', 'desc')
		if (this.props.uid)
			query = query.where('uid', '==', this.props.uid);
		else {
			const followees = await Fire.shared.getFollowees(Fire.shared.uid);
			// 'in' => max 10 dans un tableau
			// Il faut split followees en chunks de 10 users
			query = query.where('uid', 'in', [Fire.shared.uid, ...followees.map(e => e.data().followeeId)])
		}
		this.unsubscribe = query.onSnapshot(querySnapshot => {
			if (this.state.posts.length == 0) return;
			querySnapshot.docChanges().forEach(async change => {
				if (change.type === 'added') {
					const user = await this.getUser(change.doc.data().uid);
					if (change.doc.data().opid) {
						const op = await this.firestore.collection('posts').doc(change.doc.data().opid).get();
						const opUser = await this.getUser(op.data().uid);
						const isReposted = op.data().reposts.indexOf(this.uid) >= 0;
						return {
							id: change.doc.id,
							username: opUser.username,
							profileImage: opUser.profileImage,
							reposter: {
								id: user.id,
								username: user.username,
								profileImage: user.profileImage
							},
							opid: change.doc.data().opid,
							isReposted: isReposted,
							...op.data()
						};
					}
					const isReposted = change.doc.data().reposts.indexOf(this.uid) >= 0;
					return {
						id: change.doc.id,
						username: user.username,
						profileImage: user.profileImage,
						isReposted: isReposted,
						...change.doc.data()
					};
				}
				else if (change.type === 'removed') {
					await this.setState({
						posts: this.state.posts.filter(e => e.id !== change.doc.id)
					});
				}
			});
		});
	}

	async componentDidMount() {
		this.subscribe();
		this.makeRequest();
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	render() {
		return (
			<FlatList
				style={styles.feed}
				data={this.state.posts}
				renderItem={({ item }) => (
					<Post
						{...this.props}
						post={item}
						onUsernamePress={() => {
							if (this.props.navigation)
								this.props.navigation.navigate('Profile', { uid: item.uid });
						}}
						isUserPost={Fire.shared.uid === item.uid || Fire.shared.uid === item.reposter?.id} />
				)}
				keyExtractor={e => e.id}
				showsVerticalScrollIndicator={false}
				refreshControl={
					<RefreshControl refreshing={this.state.loading} onRefresh={async () => {
						await this.setState({ posts: [] });
						this.cursor = null;
						this.endReached = false;
						this.subscribe();
						this.makeRequest();
					}} />
				}
				onEndReached={() => this.makeRequest()}
				ListFooterComponent={
					<ActivityIndicator size='large' color='#61DBFB' animating={this.state.loading} />
				}
			/>
		);
	}
}

export default Feed;

const styles = StyleSheet.create({
	feed: {
		flex: 1,
		paddingTop: 6,
		paddingHorizontal: 12,
		width: '100%',
		backgroundColor: '#222'
	}
});
