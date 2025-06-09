import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { highlightMatch } from "@/lib/highlightMatch";

interface TaskCardProps {
  task: any;
  searchTerm?: string;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  searchTerm = "",
}) => {
  const {
    taskName,
    completedProperties,
    totalProperties,
    parentElementNameTree,
    dueDateTime,
    result,
    assigneeEmployee,
  } = task;

  const nameParts = highlightMatch(taskName, searchTerm);
  const progress = `${completedProperties}/${totalProperties}`;
  const path = parentElementNameTree?.join(" / ") ?? "";
  const statusIcon = result === "Done" ? "✅" : "⭕️";

  const dueDate = new Date(dueDateTime);
  const now = new Date();
  const isOverdue = dueDate < now && result !== "Done"; // ⏰

  const formattedDate = dueDate.toLocaleDateString("de-AT");

  const avatarId = assigneeEmployee?.avatarImage?.id;
  const avatarUrl = avatarId
    ? `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/images/resort-409a24db-159d-4455-80ab-057a23ba4728/${avatarId}/downloadtoken-271f8d09-c3b3-428c-ab50-ce0fdce5ca43`
    : null;

  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/task-detail",
      params: { task: JSON.stringify(task) },
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {statusIcon}{" "}
            {nameParts.map((part, index) => (
              <Text
                key={index}
                style={part.match ? styles.highlight : undefined}
              >
                {part.text}
              </Text>
            ))}
          </Text>
          <Text style={styles.progress}>{progress}</Text>
        </View>
        <Text style={styles.path}>{path}</Text>

        <View style={styles.footer}>
          {avatarUrl && (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          )}
          <Text style={[styles.date, isOverdue && styles.dateOverdue]}>
            {isOverdue ? "⚠️ " : ""}
            {formattedDate}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  title: {
    fontWeight: "bold",
    fontSize: 16,
    flexWrap: "wrap",
    flexShrink: 1,
  },
  highlight: {
    backgroundColor: "#ffeb3b",
  },
  progress: {
    fontSize: 14,
    color: "#666",
  },
  path: {
    marginTop: 4,
    color: "#888",
  },
  footer: {
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
  date: {
    fontSize: 14,
    color: "#555",
  },
  dateOverdue: {
    color: "#d32f2f", // 🔴 Rot für überfällig
    fontWeight: "600",
  },
});
