import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { account, ID } from './Appwrites';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
export default function SignUpPage({ navigation }) {
	const [user, setUser] = useState('');
	const [name, setName] = useState('');
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function login(email, password) {
		try {
			const loggedIn = await account.createEmailSession(email, password);
			setUser(loggedIn);
			navigation.replace('Idea');
		} catch (e) {
			console.log('error logging in', e);
			setError(`Error logging in ${e}`);
		}
	}
	async function register(email, password, name) {
		try {
			await account.create(ID.unique(), email, password, name);
			await login(email, password);
			navigation.replace('Idea');
		} catch (e) {
			console.log('Error registering', e);
			setError(`Error registering ${e}`);
			navigation.navigate('Home', { email: email });
		}
	}
	return (
		<SafeAreaView>
			<View style={{ margin: 20 }}>
				<View style={{ padding: 1, margin: 20 }}>
					<Text style={styles.displayLarge}>
						Welcome to IdeaTracker{' '}
						<MaterialIcons name='lightbulb-outline' size={80} color='black' />
					</Text>
					<Text variant='headlineSmall'>
						Ideas Made Simple, Dreams Made Real
					</Text>
				</View>
				<Text style={{ color: 'red' }}>{error}</Text>
				<Card>
					<Card.Content>
						<TextInput
							label='Name'
							placeholder='Name'
							value={name}
							onChangeText={(e) => {
								setName(e);
							}}
							style={styles.margins}
						/>
						<TextInput
							label='Email'
							placeholder='Email'
							value={email}
							onChangeText={(e) => {
								setEmail(e);
							}}
							style={styles.margins}
						/>
						<TextInput
							label='Password'
							placeholder='Password'
							secureTextEntry
							value={password}
							onChangeText={(e) => {
								setPassword(e);
							}}
							style={styles.margins}
						/>
						<View style={styles.margins}>
							<Button
								text='Sign Up '
								onPress={() => register(email, password, name)}
								style={styles.margins}
								mode='contained'
							>
								Sign Up
							</Button>
						</View>
					</Card.Content>
				</Card>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	margins: {
		margin: 10,
	},
	displayLarge: {
		'fontSize': 67,
		'fontWeight': 'bold',
		'letterSpacing': 0,
		'lineHeight': 64,
		marginTop: 30,
	},
});
