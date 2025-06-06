import { Stack, useRouter } from 'expo-router';
import { useContext, useState } from 'react';
import { Button, TextInput } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function LoginScreen() {
  const { setToken } = useContext(AuthContext);
  const [value, setValue] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    if (value.trim()) {
      setToken(value.trim());
      router.replace('/');
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Login' }} />
      <ThemedView style={{ flex: 1, justifyContent: 'center', padding: 16 }}>
        <ThemedText type="title">Login</ThemedText>
        <TextInput
          placeholder="Token"
          value={value}
          onChangeText={setValue}
          style={{ borderWidth: 1, marginVertical: 12, padding: 8 }}
        />
        <Button title="Anmelden" onPress={handleLogin} />
      </ThemedView>
    </>
  );
}
