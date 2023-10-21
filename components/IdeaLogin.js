import { useState } from 'react';
import { useUser } from './userContexts';
import { Text, View, StyleSheet } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-rapi-ui';
export function Login() {
	const user = useUser();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	return (
		<View>
			<Text>Login or register</Text>
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
				label='password'
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
					onPress={() => user.login(email, password)}
					style={styles.margins}
				/>
				<Button
					text='Sign Up '
					onPress={() => user.register(email, password)}
					style={styles.margins}
				/>
			</View>
		</View>
	);
}
const styles = StyleSheet.create({
	margins: {
		margin: 10,
	},
});
