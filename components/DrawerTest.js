import * as React from 'react';
import { Button, Text } from 'react-native';
import { Drawer } from 'react-native-drawer-layout';

import { SafeAreaView } from 'react-native-safe-area-context';
export default function DrawerExample() {
	const [open, setOpen] = React.useState(false);

	return (
		<Drawer
			open={open}
			onOpen={() => setOpen(true)}
			onClose={() => setOpen(false)}
			renderDrawerContent={() => {
				return (
					<SafeAreaView>
						<Text>Drawer content</Text>
					</SafeAreaView>
				);
			}}
		>
			<SafeAreaView>
				<Button
					onPress={() => setOpen((prevOpen) => !prevOpen)}
					title={`${open ? 'Close' : 'Open'} drawer`}
					style={{
						justifyContent: 'center',
						alignSelf: 'center',
						padding: 100,
					}}
				/>
			</SafeAreaView>
		</Drawer>
	);
}
