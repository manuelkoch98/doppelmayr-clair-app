// LoginScreen.tsx
import { Stack, useRouter } from "expo-router";
import { useContext, useState } from "react";
import { Alert, View, Image } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import PrimaryButton from "@/components/PrimaryButton";
import CustomTextInput from "@/components/CustomInputText";
import headerImage from "@/assets/images/login-header.png";

export default function LoginScreen() {
  const { setToken, setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const resortId = "resort-409a24db-159d-4455-80ab-057a23ba4728";
      const authResponse = await fetch(
        `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/usermanagement/users/${resortId}/authenticate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        }
      );

      if (!authResponse.ok) {
        const error = await authResponse.json().catch(() => ({}));
        throw new Error(error.message || error.error || "Unbekannter Fehler");
      }

      const authData = await authResponse.json();
      const token = authData.jwtToken?.token;
      const userGuid = authData.jwtToken?.userGuid;

      if (!token || !userGuid) throw new Error("Token oder Benutzer fehlt");

      const userId = `user-${userGuid.toLowerCase()}`;
      const userResponse = await fetch(
        `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/usermanagement/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!userResponse.ok)
        throw new Error("Benutzerdetails konnten nicht geladen werden");

      const userDetails = await userResponse.json();

      const avatarId = userDetails?.avatarImage?.id;
      const avatarUrl = avatarId
        ? `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/images/${resortId}/${avatarId}`
        : undefined;

      setToken(token);
      setUser({
        id: userId,
        username: userDetails.username ?? username,
        firstName: userDetails.firstName ?? "",
        lastName: userDetails.lastName ?? "",
        email: userDetails.email ?? "",
        phone: userDetails.phone ?? "",
        locale: userDetails.locale ?? "de",
        avatarImage: avatarUrl,
      });

      router.replace("/");
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Anmeldung nicht möglich");
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: "Login" }} />
      <ThemedView style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Image
          source={headerImage}
          style={{
            width: "100%",
            height: 160,
            resizeMode: "contain",
            marginBottom: 24,
          }}
        />
        <CustomTextInput
          placeholder="Benutzername"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <CustomTextInput
          placeholder="Passwort"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <PrimaryButton title="Anmelden" onPress={handleLogin} />
      </ThemedView>
    </>
  );
}
