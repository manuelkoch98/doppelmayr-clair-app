import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function ContactSales() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact Sales</Text>
      <Text>Get in touch with our support team by emailing support@example.com.</Text>
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
