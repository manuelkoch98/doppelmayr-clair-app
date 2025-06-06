import React from "react";
import {
  TouchableOpacity,
  ActivityIndicator,
  Text,
  StyleSheet,
} from "react-native";

interface Props {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function PrimaryButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
}: Props) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isLoading || disabled}
      style={[styles.button, (isLoading || disabled) && styles.buttonDisabled]}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.text}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#007E7A",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 64,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2.5,
    elevation: 3,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  text: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "500",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
});
