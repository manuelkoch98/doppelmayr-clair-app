import { useContext, useEffect, useState } from 'react';
import { FlatList, Text } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

interface Task {
  id?: string;
  title?: string;
}

export default function TasksScreen() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    if (!token) return;
    fetch('https://app-app-nightly-be-vcur.azurewebsites.net/v1/Tasks', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setTasks(Array.isArray(data) ? data : []))
      .catch((err) => console.error(err));
  }, [token]);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">Tasks</ThemedText>
      <FlatList
        data={tasks}
        keyExtractor={(item, index) => String(item.id ?? index)}
        renderItem={({ item }) => (
          <Text>{item.title ?? JSON.stringify(item)}</Text>
        )}
        ListEmptyComponent={<Text>Keine Tasks gefunden</Text>}
      />
    </ThemedView>
  );
}
