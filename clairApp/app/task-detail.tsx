import { Stack, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  Text,
  TextInput,
  View,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function TaskDetailScreen() {
  const { task } = useLocalSearchParams();
  const [parsedTask, setParsedTask] = useState<any>(null);

  useEffect(() => {
    if (typeof task === "string") {
      const parsed = JSON.parse(task);
      console.log("Task Detail geladen:", parsed);
      setParsedTask(parsed);
    }
  }, [task]);

  if (!parsedTask) return <Text style={styles.loading}>Lade...</Text>;

  const {
    taskName,
    taskType,
    taskSourceType,
    result,
    dueDateTime,
    createdDateTime,
    isOverdue,
    assigneeEmployee,
    parentElementNameTree,
    totalProperties,
    completedProperties,
    description,
    properties,
  } = parsedTask;

  const formattedDue = new Date(dueDateTime).toLocaleString("de-AT");
  const formattedCreated = new Date(createdDateTime).toLocaleString("de-AT");
  const path = parentElementNameTree?.join(" / ");

  const avatarUrl = assigneeEmployee?.avatarImage?.id
    ? `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/images/resort-409a24db-159d-4455-80ab-057a23ba4728/${assigneeEmployee.avatarImage.id}`
    : undefined;

  return (
    <>
      <Stack.Screen
        options={{
          title: "Aufgabe", // Text im Back-Button
          headerTintColor: "#007E7A", // ← Clair-Primary-Farbe für Icon & Text
          headerBackTitle: "Zurück",
        }}
      />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>{taskName}</Text>
        <Text style={styles.path}>{path}</Text>

        <View style={styles.metaBox}>
          <Text style={styles.meta}>
            <Text style={styles.label}>Beschreibung:</Text> {description}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.label}>Typ:</Text> {taskType} ({taskSourceType})
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.label}>Status:</Text>{" "}
            <Text style={{ color: isOverdue ? "#d32f2f" : "#00796B" }}>
              {result}
              {isOverdue ? " ⚠️ (überfällig)" : ""}
            </Text>
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.label}>Erstellt am:</Text> {formattedCreated}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.label}>Fällig bis:</Text> {formattedDue}
          </Text>
          <Text style={styles.meta}>
            <Text style={styles.label}>Fortschritt:</Text> {completedProperties}
            /{totalProperties}
          </Text>
          {assigneeEmployee && (
            <View style={styles.assignee}>
              {avatarUrl && (
                <Image source={{ uri: avatarUrl }} style={styles.avatar} />
              )}
              <Text>
                <Text style={styles.label}>Zugewiesen an:</Text>{" "}
                {assigneeEmployee.firstName} {assigneeEmployee.lastName}
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Tätigkeiten</Text>
        {properties?.length > 0 ? (
          properties.map((property: any) => (
            <View key={property.id} style={styles.propertyBox}>
              <Text style={styles.propertyLabel}>{property.name}</Text>
              {property.type === "DecimalInputField" ? (
                <TextInput
                  keyboardType="numeric"
                  style={styles.input}
                  placeholder={`Wert in ${property.unitDisplayName}`}
                />
              ) : property.type === "DateInputField" ? (
                <DateTimePicker
                  value={new Date()}
                  mode="date"
                  display="default"
                  style={{ marginTop: 8 }}
                />
              ) : (
                <Text style={{ color: "red" }}>Typ nicht unterstützt</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={{ marginTop: 16 }}>Keine Tätigkeiten vorhanden</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loading: {
    padding: 16,
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  path: {
    marginBottom: 12,
    color: "#666",
  },
  metaBox: {
    marginBottom: 20,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  meta: {
    marginBottom: 4,
  },
  label: {
    fontWeight: "600",
  },
  assignee: {
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  propertyBox: {
    marginBottom: 12,
  },
  propertyLabel: {
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
  },
});
