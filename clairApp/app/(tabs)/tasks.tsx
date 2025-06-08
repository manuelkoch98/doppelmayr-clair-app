import { useContext, useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
} from "react-native";
import { AuthContext } from "@/contexts/AuthContext";
import { ThemedView } from "@/components/ThemedView";
import { TaskCard } from "@/components/TaskCard";

export default function TasksScreen() {
  const { token } = useContext(AuthContext);
  const [tasks, setTasks] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assignees, setAssignees] = useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedAssigneeId, setSelectedAssigneeId] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false); // Für globales Overlay

  const fetchTasks = async (employeeId?: string, showLoader = false) => {
    if (!token) return;
    if (showLoader) setIsLoading(true);
    try {
      const baseUrl = `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/taskmanagement/missions`;
      const resortId = "resort-409a24db-159d-4455-80ab-057a23ba4728";
      const params = new URLSearchParams({
        elementId: resortId,
        clusterCategory: "tasktype",
        combine: "false",
        orderBy: "asc",
      });

      if (employeeId) {
        params.append("responsibility[0]", employeeId);
      }

      const url = `${baseUrl}?${params.toString()}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (!res.ok) throw new Error("Fehler beim Laden der Tasks");

      const data = await res.json();
      const flatTasks = Array.isArray(data)
        ? data.flatMap((cluster: any) => cluster.missions || [])
        : [];

      setTasks(flatTasks);

      const unique = new Map<string, string>();
      flatTasks.forEach((task: any) => {
        const id = task.assigneeEmployee?.id;
        const name = `${task.assigneeEmployee?.firstName ?? ""} ${
          task.assigneeEmployee?.lastName ?? ""
        }`.trim();
        if (id && name) unique.set(id, name);
      });

      setAssignees(
        Array.from(unique.entries()).map(([id, name]) => ({ id, name }))
      );
    } catch (err) {
      console.error("Fehler beim Abrufen der Daten:", err);
    } finally {
      if (showLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const filteredTasks = tasks.filter((task) =>
    task.taskName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleClearSearch = () => setSearchTerm("");

  const handleAssigneeSelect = (id: string | null) => {
    setSelectedAssigneeId(id);
    fetchTasks(id ?? undefined, true); // mit Ladespinner
  };

  return (
    <ThemedView style={{ flex: 1, padding: 16 }}>
      {/* 🔄 Fullscreen Loading Overlay */}
      <Modal visible={isLoading} transparent animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      </Modal>

      {/* 🔍 Textsuche */}
      <View style={{ flexDirection: "row", marginBottom: 12 }}>
        <TextInput
          placeholder="Tasks durchsuchen..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 10,
          }}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity
            onPress={handleClearSearch}
            style={{
              marginLeft: 8,
              justifyContent: "center",
              paddingHorizontal: 12,
              backgroundColor: "#eee",
              borderRadius: 8,
            }}
          >
            <Text style={{ fontWeight: "bold" }}>X</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 👤 Filter nach Beauftragtem */}
      <View style={{ height: 40, marginBottom: 16 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            gap: 8,
            alignItems: "center",
            paddingVertical: 4,
          }}
        >
          <TouchableOpacity
            onPress={() => handleAssigneeSelect(null)}
            style={[
              styles.filterButton,
              !selectedAssigneeId && styles.filterButtonActive,
            ]}
          >
            <Text style={styles.filterButtonText}>Alle</Text>
          </TouchableOpacity>

          {assignees.map((a) => (
            <TouchableOpacity
              key={a.id}
              onPress={() => handleAssigneeSelect(a.id)}
              style={[
                styles.filterButton,
                selectedAssigneeId === a.id && styles.filterButtonActive,
              ]}
            >
              <Text style={styles.filterButtonText}>{a.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* 📋 Taskliste */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TaskCard task={item} searchTerm={searchTerm} />
        )}
        ListEmptyComponent={<Text>Keine Tasks gefunden</Text>}
        refreshing={refreshing}
        onRefresh={async () => {
          setRefreshing(true);
          await fetchTasks(selectedAssigneeId ?? undefined);
          setRefreshing(false);
        }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    minHeight: 30, // <- Fixe Mindesthöhe
    backgroundColor: "#eee",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#bbb",
  },
  filterButtonText: {
    fontSize: 14,
    lineHeight: 20, // <- definiert die Höhe des Textes
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
});
