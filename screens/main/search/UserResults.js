import React from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';

import UserPreview from '../../../components/UserPreview';

import globalStyles from '../../../globalStyles';

const UserResults = (props) => (
	<View style={styles.container}>
		<FlatList
			data={props.usersFound}
			renderItem={({ item, index }) => (
				<UserPreview
					{...props}
					user={item}
					separator={index > 0} />
			)}
			keyExtractor={e => e.id} />
	</View>
);

export default UserResults;

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#333',
		flex: 1,
		alignItems: 'center',
		paddingVertical: 20
	}
})
