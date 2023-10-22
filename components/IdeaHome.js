import { View, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { account, ID } from './Appwrites';
import { MaterialIcons } from '@expo/vector-icons';
import {
	TextInput,
	Button,
	ProgressBar,
	ActivityIndicator,
	Text,
	Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PreventRemoveContext } from '@react-navigation/native';

export default function IdeaHome({ route, navigation }) {
	const [title, setTitle] = useState('');
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [description, setDescription] = useState('');
	const [user, setUser] = useState(null);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	useEffect(() => {
		const hasParams = route.params !== undefined ? true : false;
		if (hasParams) {
			setError('User already exists, Log in');
			const { email } = route.params;
			setEmail(email);
		}
	});

	async function login(email, password) {
		try {
			const loggedIn = await account.createEmailSession(email, password);
			setUser(loggedIn);
			setError('');
			navigation.replace('Idea');
		} catch (e) {
			console.log('error logging in', e);
			setError(`Error logging in ${e}`);
		}
	}

	// async function logout() {
	// 	await account.deleteSession('current');
	// 	setUser(null);
	// }

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
				<Card style={{ padding: 20 }}>
					<Card.Content>
						<TextInput
							label='Email'
							placeholder='Email'
							value={email}
							onChangeText={(e) => {
								setEmail(e);
							}}
							style={styles.margins}
						/>
					</Card.Content>
					<Card.Content>
						<TextInput
							label='Password'
							secureTextEntry
							right={<TextInput.Icon icon='eye' />}
							placeholder='Password'
							value={password}
							onChangeText={(e) => {
								setPassword(e);
							}}
							style={styles.margins}
						/>
					</Card.Content>
					<Card.Content>
						<View style={styles.margins}>
							<Button
								text='Login'
								onPress={() => login(email, password)}
								style={styles.margins}
								mode='contained'
							>
								Login
							</Button>
							<Card.Content>
								<Text variant='labelSmall'>New User? </Text>
							</Card.Content>
							<Button
								text='Sign Up '
								onPress={() => navigation.navigate('SignUp')}
								style={styles.margins}
								mode='outlined'
							>
								Sign Up
							</Button>
							{/* {isLoading ? <ActivityIndicator size={'large'} /> : null} */}
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
	headerText: {},
	displayLarge: {
		'fontSize': 67,
		'fontWeight': 'bold',
		'letterSpacing': 0,
		'lineHeight': 64,
		marginTop: 30,
	},
});
