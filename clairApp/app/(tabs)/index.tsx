import { useState } from 'react';
import { Button, FlatList, Text, TextInput } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function HomeScreen() {
  const [widgets, setWidgets] = useState<string[]>([]);
  const [text, setText] = useState('');

  const addWidget = () => {
    if (text.trim()) {
      setWidgets([...widgets, text.trim()]);
      setText('');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Startseite</ThemedText>
      <TextInput
        placeholder="Neues Widget"
        value={text}
        onChangeText={setText}
        style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
      />
      <Button title="Widget hinzufügen" onPress={addWidget} />
      <FlatList
        data={widgets}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item}</Text>}
        style={{ marginTop: 16 }}
      />
    </ThemedView>
  );
}
