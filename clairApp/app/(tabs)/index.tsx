import React, { useEffect, useState, useContext } from "react";
import { View, StyleSheet, ActivityIndicator, Dimensions } from "react-native";
import MapView, { Polyline } from "react-native-maps";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function HomeScreen() {
  const { token, user } = useContext(AuthContext);
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchMapData = async () => {
    try {
      const dashboardRes = await fetch(
        "https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/resortmanagement/dashboards?dashboardType=Homepage",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const dashboards = await dashboardRes.json();
      const hasMap = dashboards?.[0]?.widgets?.some(
        (w: any) => w.widgetType === "map"
      );
      if (!hasMap) return;

      const geoRes = await fetch(
        "https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/resortmanagement/geolocation",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const geoData = await geoRes.json();
      setCoordinates(geoData?.[0]?.coordinates || []);
    } catch (err) {
      console.warn("Fehler beim Laden der Resortkarte:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMapData();
  }, [token]);

  const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim();

  const dateStr = new Date().toLocaleString("de-AT", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Guten Morgen";
    if (hour >= 12 && hour < 18) return "Schönen Nachmittag";
    return "Guten Abend";
  };

  const greeting = `${getGreeting()} ${fullName}`;

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ThemedText type="title">{greeting}</ThemedText>
      <ThemedText style={{ marginBottom: 12 }}>{dateStr}</ThemedText>
      {loading ? (
        <ActivityIndicator size="large" />
      ) : coordinates.length > 0 ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: coordinates[0].lat,
            longitude: coordinates[0].lng,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          <Polyline
            coordinates={coordinates.map((c) => ({
              latitude: c.lat,
              longitude: c.lng,
            }))}
            strokeColor="#333"
            strokeWidth={4}
          />
        </MapView>
      ) : (
        <ThemedText>Keine Kartendaten gefunden.</ThemedText>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  map: {
    width: SCREEN_WIDTH - 32,
    height: 500,
    marginTop: 16,
    borderRadius: 12,
  },
});
