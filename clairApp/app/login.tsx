import { Stack, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Alert, Button, TextInput } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function LoginScreen() {
  const { setToken } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const resortId = 'resort-10b90e8b-d991-4153-aed1-e06a79a44b1c';

  const handleLogin = async () => {
    try {
      const response = await fetch(
        `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/usermanagement/users/${resortId}/authenticate`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        throw new Error('Login fehlgeschlagen');
      }

      const data = await response.json();
      const token = data.token || data.jwtToken || data.accessToken;
      if (token) {
        setToken(token);
        router.replace('/');
      } else {
        throw new Error('Token fehlt in Antwort');
      }
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', 'Anmeldung nicht möglich');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <ThemedText type="title">Login</ThemedText>
        <TextInput
          placeholder="Benutzername"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
        />
        <TextInput
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{ borderWidth: 1, marginVertical: 8, padding: 8 }}
        />
        <Button title="Anmelden" onPress={handleLogin} />
      </ThemedView>
    </>
  );
}
