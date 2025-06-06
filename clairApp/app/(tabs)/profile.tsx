import { useContext, useState } from "react";
import {
  Alert,
  Button,
  TextInput,
  Image,
  ActivityIndicator,
  View,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useRouter } from "expo-router";
import PrimaryButton from "@/components/PrimaryButton";
import CustomInputText from "@/components/CustomInputText";
import LogoutButton from "@/components/LogoutButton";

export default function ProfileScreen() {
  const { token, setToken, user, setUser } = useContext(AuthContext);
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false); // <--- Neu

  const [localUser, setLocalUser] = useState({
    id: user?.id ?? "",
    username: user?.username ?? "",
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    language: user?.locale ?? "",
    phone: user?.phone ?? "",
    avatarImage: user?.avatarImage ?? "",
  });

  const handleSave = async () => {
    if (!token) return;

    setIsSaving(true); // Start loading

    console.log("Request to save user", {
      id: localUser.id,
      body: {
        firstName: localUser.firstName,
        lastName: localUser.lastName,
        email: localUser.email,
        phone: localUser.phone,
      },
      token,
    });

    try {
      const response = await fetch(
        `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/usermanagement/users/${localUser.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: localUser.firstName,
            lastName: localUser.lastName,
            email: localUser.email,
            phone: localUser.phone,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("Fehler beim Speichern:", response.status, errorText);
        throw new Error("Update fehlgeschlagen");
      }

      setUser?.({ ...user, ...localUser });
      Alert.alert("Erfolg", "Profil gespeichert");
    } catch (err) {
      console.error(err);
      Alert.alert("Fehler", "Profil konnte nicht gespeichert werden");
    } finally {
      setIsSaving(false); // End loading
    }
  };

  const avatarUrl = localUser.avatarImage?.trim()
    ? localUser.avatarImage
    : `https://i.pravatar.cc/100?u=${localUser.username}`;

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <Image
        source={{ uri: avatarUrl }}
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          alignSelf: "center",
          marginBottom: 16,
        }}
      />
      <CustomInputText
        label="Benutzername"
        value={localUser.username}
        readOnly
      />
      <CustomInputText
        label="Vorname"
        value={localUser.firstName}
        onChangeText={(t) => setLocalUser({ ...localUser, firstName: t })}
      />
      <CustomInputText
        label="Nachname"
        value={localUser.lastName}
        onChangeText={(t) => setLocalUser({ ...localUser, lastName: t })}
      />
      <CustomInputText
        label="E-Mail"
        value={localUser.email}
        onChangeText={(t) => setLocalUser({ ...localUser, email: t })}
        keyboardType="email-address"
      />
      <CustomInputText
        label="Telefon"
        value={localUser.phone}
        onChangeText={(t) => setLocalUser({ ...localUser, phone: t })}
        keyboardType="phone-pad"
      />
      <CustomInputText label="Sprache" value={localUser.language} readOnly />

      {isSaving ? (
        <ActivityIndicator size="large" />
      ) : (
        <View style={{ marginTop: 24 }}>
          <PrimaryButton title="Speichern" onPress={handleSave} />
        </View>
      )}

      <LogoutButton />
    </ThemedView>
  );
}
