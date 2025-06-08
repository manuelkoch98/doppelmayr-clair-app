import { AuthContext } from "@/contexts/AuthContext";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";

interface WidgetConfig {
  timeRangeStart?: string;
  timeRangeEnd?: string;
  [key: string]: any;
}

export const SingleValueWidget = ({ widget }: { widget: any }) => {
  const { token, setToken, user, setUser } = useContext(AuthContext);
  const [value, setValue] = useState("-");
  const [timestamp, setTimestamp] = useState("-");

  let config: WidgetConfig = {};

  try {
    config = JSON.parse(widget?.jsonBlob || "{}");
  } catch (err) {
    console.warn("JSON Parse Error in SingleValueWidget:", widget?.id, err);
  }

  const unit = widget.properties?.[0]?.unitInfo?.abbreviation ?? "";
  const title = widget.title ?? "Neues Widget";

  useEffect(() => {
    const prop = widget.properties?.[0];
    if (!prop || !config.timeRangeStart || !config.timeRangeEnd || !token)
      return;

    // Zeitraum erweitern
    const from = new Date(config.timeRangeStart);
    from.setHours(0, 0, 0, 0); // Start des Tages
    const to = new Date(config.timeRangeEnd);
    to.setHours(23, 59, 59, 999); // Ende des Tages

    const baseUrl =
      "https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/taskmanagement/properties/values";
    const url = `${baseUrl}?propertyDraftId=${prop.propertyDraftId}&elementId=${
      prop.elementId
    }&fromDateTime=${encodeURIComponent(
      from.toISOString()
    )}&toDateTime=${encodeURIComponent(to.toISOString())}`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setValue(data[0].value?.toString() ?? "-");
          setTimestamp(new Date(data[0].timestamp).toLocaleString("de-AT"));
        } else {
          console.log("ℹ️ Keine Werte im Zeitraum");
        }
      })
      .catch((err) => {
        console.warn("Fehler beim Laden der Werte:", err);
      });
  }, [widget, token]);

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
      <Text style={styles.timestamp}>{timestamp}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    maxWidth: 170,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  value: {
    fontSize: 32,
    color: "#00796B",
    fontWeight: "bold",
  },
  unit: {
    fontSize: 16,
    color: "#00796B",
    marginLeft: 4,
    marginBottom: 4,
  },
  timestamp: {
    marginTop: 8,
    fontSize: 12,
    color: "#888",
  },
});
