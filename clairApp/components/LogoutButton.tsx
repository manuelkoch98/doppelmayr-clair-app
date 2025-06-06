import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const { setToken, setUser } = useContext(AuthContext);
  const router = useRouter();

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    router.replace("/login");
  };

  return (
    <Pressable
      onPress={handleLogout}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>Logout</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#007E7A",
    backgroundColor: "#ffffff",
    alignItems: "center",
    marginTop: 16,
  },
  text: {
    color: "#007E7A",
    fontWeight: "500",
    fontSize: 14,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  pressed: {
    backgroundColor: "#f0f0f0",
  },
});
