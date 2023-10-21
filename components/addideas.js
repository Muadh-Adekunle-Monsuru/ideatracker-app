import { Text, View, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { account, ID, databases, Query } from './Appwrites';
import { useState, useEffect } from 'react';
import {
	TextInput,
	Button,
	List,
	FAB,
	Portal,
	Modal,
	PaperProvider,
} from 'react-native-paper';
export default function AddIdea() {
	const [ideas, setIdeas] = useState([]);
	const [user, setUser] = useState('');
	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [visible, setVisible] = useState(false);
	const [dataId, setDataId] = useState(false);
	const showModal = () => setVisible(true);
	const hideModal = () => setVisible(false);
	const containerStyle = { backgroundColor: 'white', padding: 50, margin: 20 };
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
		} catch (e) {
			console.log('Error fetching list:', e);
		}
	}
	useEffect(() => {
		getUser();
	}, []);
	useEffect(() => {
		init();
	}, [user]);
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
			console.log('Error adding ideas', e);
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
			console.log('error updating list', e);
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
			console.log('Error deleting data', e);
		}
	}

	return (
		<PaperProvider>
			<SafeAreaView style={styles.container}>
				<Portal>
					<Modal
						visible={updatevisible}
						onDismiss={hideUpdateModal}
						contentContainerStyle={containerStyle}
					>
						<View>
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
						</View>
					</Modal>
				</Portal>
				<Portal>
					<Modal
						visible={visible}
						onDismiss={hideModal}
						contentContainerStyle={containerStyle}
					>
						<View>
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
						</View>
					</Modal>
				</Portal>
				<View>
					<Text>My Ideas</Text>
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
});
