import { Text, View, Pressable, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { account, ID, databases, Query } from './Appwrites';
import { useState, useEffect } from 'react';
import { Drawer } from 'react-native-drawer-layout';
import { scale, verticalScale, moderateScale } from 'react-native-size-matters';
import {
	TextInput,
	Button,
	List,
	FAB,
	Portal,
	Modal,
	PaperProvider,
	Card,
} from 'react-native-paper';

import { Entypo } from '@expo/vector-icons';

export default function AddIdea({ navigation }) {
	const [error, setError] = useState('');
	const [open, setOpen] = useState(false);
	const [ideas, setIdeas] = useState([]);
	const [user, setUser] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [visible, setVisible] = useState(false);
	const [dataId, setDataId] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = {
		backgroundColor: 'white',
		margin: scale(30),
		borderRadius: 10,
	};
	const [updatevisible, setUpdateVisible] = useState(false);

	const showUpdateModal = () => setUpdateVisible(true);
	const hideUpdateModal = () => setUpdateVisible(false);
	async function getUser() {
		try {
			const loggedIn = await account.get();
			setUser(loggedIn);
		} catch (err) {
			setUser(null);
		}
	}

	async function init() {
		try {
			const response = await databases.listDocuments(
				'652ec9b04fba122b0988',
				'idea-trackers',
				[
					Query.orderDesc('$createdAt'),
					Query.limit(10),
					Query.equal('userId', [`${user.$id}`]),
				]
			);
			setIdeas(response.documents);
			setError('');
		} catch (e) {
			// console.log('Error fetching list:', e);
			setError('Error fetching list from server', JSON.stringify(e));
		}
	}
	useEffect(() => {
		getUser();
	}, []);
	useEffect(() => {
		init();
	}, [user]);
	async function logout() {
		try {
			await account.deleteSession('current');
			setUser(null);
			navigation.replace('Home');
		} catch (e) {
			// console.log('error signing out', e);
			setError('error signing out', e.response.message);
		}
	}
	async function add(idea) {
		try {
			const response = await databases.createDocument(
				'652ec9b04fba122b0988',
				'idea-trackers',
				ID.unique(),
				idea
			);
			// setIdeas((ideas) => [response.$id, ...ideas].slice(0, 10));
			init();
			setTitle('');
			setDescription('');
		} catch (e) {
			// console.log('Error adding ideas', e);
			setError('Error adding idea', e.response.message);
		}
	}
	async function update(props) {
		try {
			await databases.updateDocument(
				'652ec9b04fba122b0988',
				'idea-trackers',
				props.id,
				props.data
			);
			init();
		} catch (e) {
			// console.log('error updating list', e);
			setError('error updating list', e.response.message);
		}
	}
	async function remove(id) {
		try {
			await databases.deleteDocument(
				'652ec9b04fba122b0988',
				'idea-trackers',
				id
			);
			// setIdeas((ideas) => ideas.filter((idea) => idea.$id !== id));
			await init(); // Refetch ideas to ensure we have 10 items
		} catch (e) {
			// console.log('Error deleting data', e);
			setError('Error deleting data', e.response.message);
		}
	}

	return (
		<PaperProvider>
			<Drawer
				open={open}
				onOpen={() => setOpen(true)}
				onClose={() => setOpen(false)}
				renderDrawerContent={() => {
					return (
						<SafeAreaView style={{ padding: 20 }}>
							<Button
								text='Add Idea '
								onPress={() => {
									logout();
								}}
								style={{ marginTop: 30, padding: 10 }}
								mode='contained'
								buttonColor='red'
							>
								Sign Out
							</Button>
						</SafeAreaView>
					);
				}}
			>
				<SafeAreaView style={styles.container}>
					<Portal>
						<Modal
							visible={updatevisible}
							onDismiss={hideUpdateModal}
							contentContainerStyle={containerStyle}
						>
							<Card style={{ padding: scale(10) }}>
								<Text style={styles.paragraph}>Update Idea</Text>
								<TextInput
									label='Title'
									placeholder='Title'
									value={title}
									onChangeText={(e) => {
										setTitle(e);
									}}
									style={styles.margins}
								/>
								<TextInput
									label='Description'
									placeholder='Description'
									value={description}
									onChangeText={(e) => {
										setDescription(e);
									}}
									style={styles.margins}
								/>
								<Button
									text='Add Idea '
									onPress={() => {
										update({ id: dataId, data: { title, description } });
										hideUpdateModal();
									}}
									style={styles.margins}
									mode='contained'
								>
									Update
								</Button>
							</Card>
						</Modal>
					</Portal>
					<Portal>
						<Modal
							visible={visible}
							onDismiss={hideModal}
							contentContainerStyle={containerStyle}
						>
							<Card style={{ padding: scale(10) }}>
								<Text style={styles.paragraph}>Add Idea</Text>
								<TextInput
									label='Title'
									placeholder='Title'
									value={title}
									onChangeText={(e) => {
										setTitle(e);
									}}
									style={styles.margins}
								/>
								<TextInput
									label='Description'
									placeholder='Description'
									value={description}
									onChangeText={(e) => {
										setDescription(e);
									}}
									style={styles.margins}
									multiline={true}
								/>
								<Button
									text='Add Idea '
									onPress={() => {
										add({ userId: user.$id, title, description });
										hideModal();
									}}
									style={styles.margins}
									mode='contained'
								>
									Submit
								</Button>
							</Card>
						</Modal>
					</Portal>
					<View>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								padding: 10,
							}}
						>
							<Pressable onPress={() => setOpen((prevOpen) => !prevOpen)}>
								<Entypo name='menu' size={35} color='black' />
							</Pressable>

							<Text style={{ fontSize: 35, padding: 10 }}>My Ideas</Text>
							<List.Icon icon='lightbulb-outline' size={35} color='black' />
						</View>
						<Text style={{ color: 'red' }}>{error}</Text>
						{ideas.length == 0 ? (
							<Image
								style={styles.backgroundImage}
								source={require('../assets/Group1.png')}
							/>
						) : null}
						<List.Section>
							{ideas.map((idea) => (
								<Pressable
									key={idea.$id}
									onPress={() => {
										setTitle(idea.title);
										setDescription(idea.description);
										setDataId(idea.$id);
										showUpdateModal();
									}}
								>
									<List.Item
										key={idea.$id}
										title={idea.title}
										description={idea.description}
										left={(props) => <List.Icon {...props} icon='lightbulb' />}
										right={(props) => (
											<Pressable onPress={() => remove(idea.$id)}>
												<List.Icon {...props} icon='trash-can' />
											</Pressable>
										)}
									/>
								</Pressable>
							))}
						</List.Section>
					</View>
					<FAB
						icon='plus'
						style={styles.fab}
						onPress={() => {
							setTitle('');
							setDescription('');
							showModal();
						}}
					/>
				</SafeAreaView>
			</Drawer>
		</PaperProvider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ecf0f1',
		padding: 8,
	},
	paragraph: {
		margin: 24,
		fontSize: 18,
		fontWeight: 'bold',
		textAlign: 'center',
	},
	margins: {
		margin: 10,
	},
	fab: {
		position: 'absolute',
		margin: 16,
		right: 20,
		bottom: 20,
	},
	backgroundImage: {
		width: '100%',
		height: '90%',
	},
});
