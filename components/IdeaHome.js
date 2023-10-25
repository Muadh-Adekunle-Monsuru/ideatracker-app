import { View, StyleSheet, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { account, ID } from './Appwrites';
import { MaterialIcons } from '@expo/vector-icons';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import Joi from 'react-native-joi';
import {
	TextInput,
	Button,
	ActivityIndicator,
	Text,
	Card,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PreventRemoveContext } from '@react-navigation/native';

export default function IdeaHome({ route, navigation }) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [user, setUser] = useState(null);

	const [showPassword, setShowPassword] = useState(false);
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

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	async function login(email, password) {
		try {
			const loggedIn = await account.createEmailSession(email, password);
			setUser(loggedIn);
			setError('');
			navigation.replace('Idea');
		} catch (e) {
			setError(`Error logging in ${e.response.message}`);
		}
	}
	const validationSchema = Joi.object().keys({
		email: Joi.string()
			.email({ tlds: { allow: false } })
			.required(),
		password: Joi.string().min(8).required(),
	});
	const validateInput = () => {
		Joi.validate({ email, password }, validationSchema, (error) => {
			if (error) {
				console.log(error);
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
				<View style={{}}>
					<Card style={{ padding: scale(10) }}>
						<Card.Content>
							<Card.Content>
								<Text style={{ color: 'red' }}>{error}</Text>
							</Card.Content>
							<TextInput
								label='Email'
								placeholder='Email'
								value={email}
								onChangeText={(e) => {
									setEmail(e);
								}}
								onBlur={validateInput}
								style={styles.margins}
							/>
						</Card.Content>
						<Card.Content>
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
