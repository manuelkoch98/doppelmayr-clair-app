import React from "react";
import {
  TextInput,
  TextInputProps,
  StyleSheet,
  View,
  Text,
} from "react-native";

interface Props extends TextInputProps {
  label?: string;
  readOnly?: boolean;
}

export default function CustomTextInput({
  label,
  readOnly,
  style,
  ...rest
}: Props) {
  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        editable={!readOnly}
        placeholderTextColor="#888"
        style={[styles.input, readOnly && styles.readOnlyInput, style]}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  label: {
    fontSize: 13,
    color: "#444",
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 6,
    backgroundColor: "#fff",
    fontSize: 15,
  },
  readOnlyInput: {
    backgroundColor: "#eee",
    color: "#666",
  },
});
