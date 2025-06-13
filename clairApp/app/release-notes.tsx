import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ReleaseNotes() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Release Notes</Text>
      <Text>Latest updates and changes to the app will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
