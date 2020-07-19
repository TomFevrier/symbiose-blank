import React from 'react';
import { Container, Tabs, Tab, TabHeading } from 'native-base';

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import Layout from '../../components/Layout';
import InfoSection from './profile/InfoSection';
import PostsSection from './profile/PostsSection';
import PlaylistSection from './profile/PlaylistSection';

import Fire from '../../utils/firebase';
import Spotify from '../../utils/spotify';

import globalStyles from '../../globalStyles';

class ProfileScreen extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			loading: true
		};
		this.refresh = this.refresh.bind(this);
	}

	componentDidMount() {
		this.unsubscribe = this.props.navigation.addListener('focus', this.refresh);
	}

	componentWillUnmount() {
		this.unsubscribe();
	}

	async refresh() {
		const user = await Fire.shared.getUser(this.props.uid || Fire.shared.uid);
		const isFollowing = await Fire.shared.isFollowing(user.id);
		const followers = await Fire.shared.getFollowers(user.id);
		const followees = await Fire.shared.getFollowees(user.id);
		const nbPosts = await Fire.shared.getNbPosts(user.id);

		if (user.id == Fire.shared.uid) {
			const data = await Spotify.get('/me');
			if (data.images && data.images.length > 0){
				await Fire.shared.addProfileImage(data.images[0].url);
			}

		}
		const { profileImage, currentlyPlaying } = await Fire.shared.getUser(user.id);

		const currentlyPlayingTrack = await Spotify.get(`/tracks/${currentlyPlaying}`);

		await this.setState({
			uid: user.id,
			username: user.username,
			firstName: user.firstName,
			lastName: user.lastName,
			isFollowing: isFollowing,
			followerCount: followers.length,
			followeeCount: followees.length,
			nbPosts: nbPosts,
			profileImage: profileImage,
			currentlyPlaying: currentlyPlayingTrack
		});

		this.setState({ loading: false });
	}
	render() {
		return (
			<Layout>
				{!this.state.loading && (
					<>
						<InfoSection
							{...this.props}
							{...this.state}
							isProfile={!this.props.uid}
							onFollowPress={() => {
								this.state.isFollowing ?
								Fire.shared.unfollow(this.state.uid) :
								Fire.shared.follow(this.state.uid)
								this.setState({
								 	isFollowing: !this.state.isFollowing,
								 	followerCount: this.state.isFollowing ? this.state.followerCount - 1 : this.state.followerCount + 1 });
							}} />
						<Container>
							<Tabs initialPage={0}>
								<Tab style={{ flex: 1 }} heading={
									<TabHeading style={{ backgroundColor: '#222' }}>
										<MaterialCommunityIcons name='library-video' size={20} color='white' />
									</TabHeading>
								}>
									<PlaylistSection {...this.props} uid={this.state.uid} />
								</Tab>
								<Tab heading={
									<TabHeading style={{ backgroundColor: '#222' }}>
										<MaterialCommunityIcons name='disc' size={26} color='white' />
									</TabHeading>
								}>
									<PostsSection uid={this.state.uid} />
								</Tab>
								<Tab heading={
									<TabHeading style={{ backgroundColor: '#222' }}>
										<MaterialCommunityIcons name='text-subject' size={23} color='white' />
									</TabHeading>
								}>
									<PostsSection uid={this.state.uid} />
								</Tab>
							</Tabs>
						</Container>
					</>
				)}
			</Layout>
		);
	}
}

export default ProfileScreen;
