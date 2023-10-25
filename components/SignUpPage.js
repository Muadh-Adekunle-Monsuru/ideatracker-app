import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { account, ID } from './Appwrites';
import { TextInput, Button, Text, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Joi from 'react-native-joi';
export default function SignUpPage({ navigation }) {
	const [user, setUser] = useState('');
	const [name, setName] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	async function login(email, password) {
		try {
			const loggedIn = await account.createEmailSession(email, password);
			setUser(loggedIn);
			navigation.replace('Idea');
		} catch (e) {
			setError(`Error logging in ${e.response.message}`);
		}
	}
	async function register(email, password, name) {
		try {
			await account.create(ID.unique(), email, password, name);
			await login(email, password);
			navigation.replace('Idea');
		} catch (e) {
			setError(` ${e.response.message}`);
			navigation.replace('Home', { email: email });
		}
	}
	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const validationSchema = Joi.object().keys({
		name: Joi.string().required(),
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		password: Joi.string().min(8).required(),
	});
	const validateInput = () => {
		Joi.validate({ name, email, password }, validationSchema, (error) => {
			if (error) {
				setError(error.details[0].message);
			} else {
				setError('');
			}
		});
	};
	return (
		<SafeAreaView style={{ flex: 1 }}>
			<View style={{ padding: scale(12), flex: 1 }}>
				<View style={{ padding: scale(10) }}>
					<Text style={styles.displayLarge}>Welcome to IdeaTracker </Text>
					<Text style={styles.headlineSmall}>
						Ideas Made Simple, Dreams Made Real
					</Text>
				</View>
				<Card>
					<Card.Content>
						<Card.Content>
							<Text style={{ color: 'red' }}>{error}</Text>
						</Card.Content>
						<TextInput
							label='Name'
							placeholder='Name'
							value={name}
							onChangeText={(e) => {
								setName(e);
							}}
							style={styles.margins}
							onBlur={validateInput}
						/>
						<TextInput
							label='Email'
							placeholder='Email'
							value={email}
							onChangeText={(e) => {
								setEmail(e);
							}}
							style={styles.margins}
							onBlur={validateInput}
						/>
						<TextInput
							label='Password'
							secureTextEntry={!showPassword}
							right={
								<TextInput.Icon
									onPress={toggleShowPassword}
									icon={showPassword ? 'eye' : 'eye-off'}
								/>
							}
							placeholder='Password'
							value={password}
							onChangeText={(e) => {
								setPassword(e);
							}}
							onBlur={validateInput}
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
		margin: scale(10),
	},
	displayLarge: {
		'fontSize': scale(47),
		'fontWeight': 'bold',
		'letterSpacing': 0,
		'lineHeight': 64,
		marginTop: 30,
	},
	'headlineSmall': {
		'fontSize': scale(14),
		'fontWeight': '400',
		'letterSpacing': 0,
		'lineHeight': 32,
	},
});
