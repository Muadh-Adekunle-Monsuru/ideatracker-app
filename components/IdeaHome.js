import { Text, View, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { account, ID } from './Appwrites';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PreventRemoveContext } from '@react-navigation/native';
export default function IdeaHome({ route, navigation }) {
	const [title, setTitle] = useState('');

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
			navigation.navigate('Idea');
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
			<View>
				<Text>Login or register</Text>
				<Text style={{ color: 'red' }}>{error}</Text>
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
					secureTextEntry
					right={<TextInput.Icon icon='eye' />}
					placeholder='Password'
					value={password}
					onChangeText={(e) => {
						setPassword(e);
					}}
					style={styles.margins}
				/>
				<View style={styles.margins}>
					<Button
						text='Login'
						onPress={() => login(email, password)}
						style={styles.margins}
						mode='contained'
					>
						Login
					</Button>
					<Button
						text='Sign Up '
						onPress={() => navigation.navigate('SignUp')}
						style={styles.margins}
						mode='outlined'
					>
						Sign Up
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	margins: {
		margin: 10,
	},
});
