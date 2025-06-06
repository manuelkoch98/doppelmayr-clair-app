import { Stack, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import type { User } from "@/contexts/AuthContext"; // Pfad ggf. anpassen

export default function LoginScreen() {
  const { setToken, setUser } = useContext(AuthContext); // <--- NEU
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const resortId = "resort-409a24db-159d-4455-80ab-057a23ba4728";

      const response = await fetch(
        `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/usermanagement/users/${resortId}/authenticate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const message =
          errorData.message || errorData.error || "Unbekannter Fehler";
        throw new Error(message);
      }

      const data = await response.json();
      console.log("Login response data:", data);

      const token = data.jwtToken?.token;
      const userGuid = data.jwtToken?.userGuid;
      const userData = data.user;

      const avatarId = userData?.avatarImage?.id;
      const avatarUrl = avatarId
        ? `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/images/resort-409a24db-159d-4455-80ab-057a23ba4728/image-${avatarId}/downloadtoken-271f8d09-c3b3-428c-ab50-ce0fdce5ca43`
        : undefined;

      const user: User = {
        id: `user-${userGuid.toLowerCase()}`,
        username: username,
        firstName: userData?.firstName ?? "",
        lastName: userData?.lastName ?? "",
        email: userData?.email ?? "",
        phone: userData?.phone ?? "",
        locale: userData?.locale ?? "de",
        avatarImage: avatarUrl,
      };

      if (token && user.id) {
        setToken(token);
        setUser(user);
        router.replace("/");
      } else {
        throw new Error("Token oder Benutzer fehlt");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Anmeldung nicht möglich");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <ThemedView style={{ flex: 1, justifyContent: "center", padding: 16 }}>
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
