import { useLocalSearchParams } from "expo-router";
import { ScrollView, Text, TextInput, View } from "react-native";
import { useEffect, useState } from "react";

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

  if (!parsedTask) return <Text>Lade...</Text>;

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 8 }}>
        Aufgabe: {parsedTask.taskName}
      </Text>

      {parsedTask?.properties?.length > 0 ? (
        parsedTask.properties.map((property: any) => (
          <View key={property.id} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: "600" }}>{property.name}</Text>
            {property.type === "DecimalInputField" ? (
              <TextInput
                keyboardType="numeric"
                style={{
                  borderWidth: 1,
                  borderColor: "#ccc",
                  borderRadius: 4,
                  padding: 8,
                  marginTop: 4,
                }}
                placeholder={`Wert in ${property.unitDisplayName}`}
              />
            ) : property.type === "ThreeState" ? (
              <Text style={{ color: "#666", marginTop: 4 }}>
                (Checkbox-Funktion kommt noch)
              </Text>
            ) : (
              <Text style={{ color: "red" }}>Typ nicht unterstützt</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={{ marginTop: 16 }}>Keine Tätigkeiten vorhanden</Text>
      )}
    </ScrollView>
  );
}
