import * as firebase from 'firebase';
import 'firebase/firestore';

const config = {
	apiKey: 'FIREBASE_API_KEY',
    authDomain: 'FIRE_BASE_AUTH_DOMAIN',
    databaseURL: 'FIREBASE_DATABASE_URL',
	projectId: 'FIREBASE_PROJECT_ID'
};

class Fire {

	constructor() {
		firebase.initializeApp(config);
		this.localPersistence = firebase.auth.Auth.Persistence.LOCAL;
	}

	get auth() {
		return firebase.auth();
	}

	get firestore() {
		return firebase.firestore();
	}

	get uid() {
		return this.auth.currentUser.uid;
	}

	async getEmail(username) {
		const querySnapshot = await this.firestore.collection('users').where('usernameLowerCase', '==', username.toLowerCase()).get();
		return querySnapshot.docs[0]?.data().email;
	}

	async getUser(uid) {
		if (!uid) return null;
		const doc = await this.firestore.collection('users').doc(uid).get();
		return doc.data();
	}

	async getPost(id) {
		if (!id) return null;
		const doc = await this.firestore.collection('posts').doc(id).get();
		return doc.data();
	}

	async getPagedPosts(cursor, number, options = {}) {
		const uid = options.uid || null;
		const showReposts = options.showReposts || false;
		let query = this.firestore.collection('posts')
			.orderBy('timestamp', 'desc')
			.limit(number);
		if (cursor)
			query = query.startAfter(cursor);
		if (uid)
			query = query.where('uid', '==', uid);
		else {
			const followees = await this.getFollowees(this.uid);
			// 'in' => max 10 dans un tableau
			// Il faut split followees en chunks de 10 users
			query = query.where('uid', 'in', [this.uid, ...followees.map(e => e.data().followeeId)])
		}
		const querySnapshot = await query.get();
		cursor = querySnapshot.docs[querySnapshot.docs.length - 1];

		const promises = querySnapshot.docs
			.map(async doc => {
				const user = await this.getUser(doc.data().uid);
				if (doc.data().opid) {
					const op = await this.firestore.collection('posts').doc(doc.data().opid).get();
					const opUser = await this.getUser(op.data().uid);
					const isReposted = op.data().reposts.indexOf(this.uid) >= 0;
					const isLiked = op.data().likes.indexOf(this.uid) >= 0;
					return {
						id: doc.id,
						username: opUser.username,
						profileImage: opUser.profileImage,
						reposter: {
							id: user.id,
							username: user.username,
							profileImage: user.profileImage
						},
						opid: doc.data().opid,
						isReposted: isReposted,
						isLiked: isLiked,
						...op.data()
					};
				}
				const isReposted = doc.data().reposts.indexOf(this.uid) >= 0;
				const isLiked = doc.data().likes.indexOf(this.uid) >= 0;
				return {
					id: doc.id,
					username: user.username,
					profileImage: user.profileImage,
					isReposted: isReposted,
					isLiked: isLiked,
					...doc.data()
				};
			});
		const posts = (await Promise.all(promises))
			.filter(e => !e.opid ||
				showReposts || e.reposter.id !== this.uid);
		return { cursor, posts };
	}

	async getFollowers(uid) {
		const querySnapshot = await this.firestore.collection('follows')
			.where('followeeId', '==', uid)
			.get();
		return querySnapshot.docs;
	}

	async getFollowees(uid) {
		const querySnapshot = await this.firestore.collection('follows')
			.where('followerId', '==', uid)
			.get();
		return querySnapshot.docs;
	}

	async getNbPosts(uid) {
		const querySnapshot = await this.firestore.collection('posts')
			.where('uid', '==', uid)
			.get();
		return querySnapshot.docs.length;
	}

	async getSpotifyCredentials() {
		const data = await this.getUser(this.uid);
		return {
			accessToken: data.accessToken,
			expirationDate: data.expirationDate,
			refreshToken: data.refreshToken
		};
	}

	addUser({ firstName, lastName, username }) {
		this.firestore.collection('users').doc(this.uid).set({
			id: this.uid,
			email: this.auth.currentUser.email,
			creationDate: Date.now(),
			firstName: firstName,
			lastName: lastName,
			username: username,
			usernameLowerCase: username.toLowerCase()
		});
	}

	addPost({ text, track, playlist }) {
		this.firestore.collection('posts').add({
			text: text,
			track: track || null,
			playlist: playlist || null,
			uid: this.uid,
			reposts: [],
			likes: [],
			timestamp: Date.now()
		});
	}

	repost(post) {
		this.firestore.collection('posts').add({
			uid: this.uid,
			opid: post.opid || post.id,
			timestamp: Date.now()
		});
		this.firestore.collection('posts')
			.doc(post.opid || post.id)
			.update({
				reposts: firebase.firestore.FieldValue.arrayUnion(this.uid)
			});
	}

	async unRepost(post) {
		const querySnapshot = await this.firestore.collection('posts')
			.where('uid', '==', this.uid)
			.where('opid', '==', post.opid || post.id)
			.get();
		querySnapshot.forEach(doc => doc.ref.delete());
		this.firestore.collection('posts')
			.doc(post.opid || post.id)
			.update({
				reposts: firebase.firestore.FieldValue.arrayRemove(this.uid)
			});
	}

	like(post) {
		this.firestore.collection('posts')
			.doc(post.opid || post.id)
			.update({
				likes: firebase.firestore.FieldValue.arrayUnion(this.uid)
			});
	}

	unLike(post) {
		this.firestore.collection('posts')
			.doc(post.opid || post.id)
			.update({
				likes: firebase.firestore.FieldValue.arrayRemove(this.uid)
			});
	}

	deletePost(post) {
		this.firestore.collection('posts').doc(post.id).delete();
	}

	async addPlaylist(name, spotifyId, pictures, tracks) {
		this.firestore.collection('playlists').add({
			name: name,
			spotifyId: spotifyId,
			owners: [this.uid],
			pictures: pictures,
			private: true,
			tracks: tracks,
			timestamp: Date.now()
		});
	}

	async getPlaylists(uid) {
		const querySnapshot = await this.firestore.collection('playlists').where('owners', 'array-contains', uid).get();
		return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
	}

	deletePlaylist(id) {
		this.firestore.collection('playlists').doc(id).delete();
	}

	async addProfileImage(profileImage){
		await this.firestore.collection('users').doc(this.uid).set({
			profileImage: profileImage
		}, { merge: true });
	}

	follow(uid) {
		this.firestore.collection('follows').doc(`${this.uid}_${uid}`).set({
			followerId: this.uid,
			followeeId: uid,
			timestamp: Date.now()
		});
	}

	unfollow(uid) {
		this.firestore.collection('follows').doc(`${this.uid}_${uid}`).delete();
	}

	async isFollowing(uid) {
		const ref = await this.firestore.collection('follows').doc(`${this.uid}_${uid}`).get();
		return ref.exists;
	}

	async searchUsers(search) {
		if (search === "") return null;
		const querySnapshot = await this.firestore.collection('users')
			.where('usernameLowerCase', '>=', search.toLowerCase())
			.where('usernameLowerCase', '<=', search.toLowerCase() + 'z')
			.get();
		return querySnapshot?.docs.map(e => e.data());
	}

	async getPinnedData(uid) {
		const data = await this.getUser(uid);
		return {
			artistOfTheMonth: data.artistOfTheMonth,
			lastSavedTrack: data.lastSavedTrack,
			mostPlayedTrack: data.mostPlayedTrack
		};
	}

	async updateData(data) {
		await this.firestore.collection('users').doc(this.uid).set(data, { merge: true });
	}

	async deleteField(field) {
		await this.firestore.collection('users').doc(this.uid).update({
		    [field]: firebase.firestore.FieldValue.delete()
		});
	}

}

Fire.shared = new Fire();

export default Fire;
