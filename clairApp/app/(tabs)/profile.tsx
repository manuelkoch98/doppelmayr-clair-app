import { useContext, useEffect, useState } from 'react';
import { Alert, Button, TextInput } from 'react-native';
import { AuthContext } from '@/contexts/AuthContext';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function ProfileScreen() {
  const { token, setToken } = useContext(AuthContext);
  const [user, setUser] = useState({
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    language: '',
    phone: '',
  });

  useEffect(() => {
    if (!token) return;
    fetch('https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/users/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) =>
        setUser({
          id: data.id ?? '',
          username: data.username ?? '',
          firstName: data.firstName ?? '',
          lastName: data.lastName ?? '',
          email: data.email ?? '',
          language: data.language ?? '',
          phone: data.phone ?? '',
        })
      )
      .catch((err) => console.error(err));
  }, [token]);

  const handleSave = async () => {
    if (!token) return;
    try {
      const response = await fetch(
        'https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/users/me',
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(user),
        }
      );

      if (!response.ok) {
        throw new Error('Update fehlgeschlagen');
      }

      Alert.alert('Erfolg', 'Profil gespeichert');
    } catch (err) {
      console.error(err);
      Alert.alert('Fehler', 'Profil konnte nicht gespeichert werden');
    }
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title" style={{ textAlign: 'center', marginBottom: 16 }}>
        Mein Profil
      </ThemedText>
      <TextInput
        placeholder="Benutzername"
        value={user.username}
        onChangeText={(t) => setUser({ ...user, username: t })}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />
      <TextInput
        placeholder="Vorname"
        value={user.firstName}
        onChangeText={(t) => setUser({ ...user, firstName: t })}
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />
      <TextInput
        placeholder="Nachname"
        value={user.lastName}
        onChangeText={(t) => setUser({ ...user, lastName: t })}
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />
      <TextInput
        placeholder="E-Mail"
        value={user.email}
        onChangeText={(t) => setUser({ ...user, email: t })}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />
      <TextInput
        placeholder="Sprache"
        value={user.language}
        onChangeText={(t) => setUser({ ...user, language: t })}
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />
      <TextInput
        placeholder="Telefon"
        value={user.phone}
        onChangeText={(t) => setUser({ ...user, phone: t })}
        keyboardType="phone-pad"
        style={{ borderWidth: 1, marginVertical: 4, padding: 8 }}
      />
      <Button title="Speichern" onPress={handleSave} />
      <Button title="Logout" onPress={() => setToken(null)} />
    </ThemedView>
  );
}
