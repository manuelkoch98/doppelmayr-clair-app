import { useContext } from 'react';
import { Button } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  const { token, setToken } = useContext(AuthContext);

  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <ThemedText type="title">Mein Profil</ThemedText>
      {token && <ThemedText>{token.substring(0, 20)}...</ThemedText>}
      <Button title="Logout" onPress={() => setToken(null)} />
    </ThemedView>
  );
}
