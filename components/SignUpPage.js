import { Text, View, StyleSheet } from 'react-native';
import { useState, useEffect } from 'react';
import { account, ID } from './Appwrites';
import { TextInput, Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
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
			navigation.navigate('Idea');
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
			<View>
				<Text>Register</Text>
				<Text style={{ color: 'red' }}>{error}</Text>
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
			</View>
		</SafeAreaView>
	);
}
const styles = StyleSheet.create({
	margins: {
		margin: 10,
	},
});
