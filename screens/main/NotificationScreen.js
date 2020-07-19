import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import Layout from '../../components/Layout';

import globalStyles from '../../globalStyles';

const NotificationScreen = () => (
	<Layout>
		<Text style={globalStyles.text}>Ding dong</Text>
	</Layout>
);

export default NotificationScreen;
