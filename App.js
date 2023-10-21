import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IdeaHome from './components/IdeaHome';
import AddIdea from './components/addideas';
import SignUpPage from './components/SignUpPage';
const Stack = createNativeStackNavigator();

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				initialRouteName={IdeaHome}
				screenOptions={{
					headerShown: false,
				}}
			>
				<Stack.Screen name='Home' component={IdeaHome} />
				<Stack.Screen name='Idea' component={AddIdea} />
				<Stack.Screen name='SignUp' component={SignUpPage} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});
