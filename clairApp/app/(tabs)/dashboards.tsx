import {
  ScrollView,
  View,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useContext, useEffect, useState, useCallback } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { SingleValueWidget } from "@/components/SingleValueWidget";
import { LineChartWidget } from "@/components/LineChartWidget";

export default function DashboardScreen() {
  const { token } = useContext(AuthContext);
  const [widgets, setWidgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboards = async () => {
    try {
      const res = await fetch(
        "https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/resortmanagement/dashboards?elementId=resort-409a24db-159d-4455-80ab-057a23ba4728&dashboardType=Dashboard",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const allWidgets = data.flatMap((d: any) => d.widgets || []);
      setWidgets(allWidgets);
    } catch (err) {
      console.error("Dashboard Ladefehler", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboards();
  }, [token]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboards();
  }, [token]);

  const singleValueWidgets = widgets.filter(
    (w) => w.widgetType === "SINGLE_VALUE"
  );
  const lineChartWidgets = widgets.filter((w) => w.widgetType === "CHART_LINE");

  const renderSingleValueRows = () => {
    const rows = [];
    for (let i = 0; i < singleValueWidgets.length; i += 2) {
      const first = singleValueWidgets[i];
      const second = singleValueWidgets[i + 1];
      rows.push(
        <View
          key={`row-${i}`}
          style={{ flexDirection: "row", gap: 16, marginBottom: 16 }}
        >
          <View style={{ flex: 1 }}>
            <SingleValueWidget widget={first} />
          </View>
          {second && (
            <View style={{ flex: 1 }}>
              <SingleValueWidget widget={second} />
            </View>
          )}
        </View>
      );
    }
    return rows;
  };

  if (loading && !refreshing) {
    return (
      <ThemedView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderSingleValueRows()}
        {lineChartWidgets.map((w) => (
          <View key={w.id} style={{ marginBottom: 16 }}>
            <LineChartWidget widget={w} />
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
}
