import { useContext, useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { TaskCard } from "@/components/TaskCard";

export default function TasksScreen() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);

  interface Task {
    id: string;
    name: string;
  }

  useEffect(() => {
    if (!token) return;

    const assetId = "asset-91b45212-41ee-44f9-aabc-24cf2ba85d1f";
    const operationPeriodId =
      "operationperiod-3cc73dc2-e1d1-4480-97d7-9e0d944b098d";
    const elementId = assetId;

    const url = `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/taskmanagement/missions?assetId=${assetId}&operationPeriodId=${operationPeriodId}&elementId=${elementId}&clusterCategory=tasktype&combine=false&orderBy=asc`;

    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler beim Laden der Tasks");
        return res.json();
      })
      .then((data) => {
        console.log("API Response", data);

        if (!Array.isArray(data)) {
          console.warn("Unerwartetes Format", data);
          return;
        }

        const flatTasks = data.flatMap((cluster: any) =>
          Array.isArray(cluster.missions) ? cluster.missions : []
        );

        setTasks(flatTasks); // Originaldaten behalten
      })
      .catch((err) => {
        console.error("Fehler beim Abrufen der Daten:", err);
      });
  }, [token]);

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TaskCard task={item} />}
        ListEmptyComponent={<Text>Keine Tasks gefunden</Text>}
      />
    </ThemedView>
  );
}
