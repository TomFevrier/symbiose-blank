import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import Layout from '../../components/Layout';

import globalStyles from '../../globalStyles';

const NotificationScreen = () => (
	<Layout style={{ justifyContent: 'center' }}>
		<Text style={[globalStyles.text, { fontSize: 300 }]}>🔑</Text>
	</Layout>
);

export default NotificationScreen;
