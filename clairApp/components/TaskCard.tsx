import { useRouter } from "expo-router";
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface TaskCardProps {
  task: any;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const {
    taskName,
    completedProperties,
    totalProperties,
    parentElementNameTree,
    dueDateTime,
    result,
    assigneeEmployee,
  } = task;

  const progress = `${completedProperties}/${totalProperties}`;
  const path = parentElementNameTree?.join(" / ") ?? "";
  const statusIcon = result === "Done" ? "✅" : "⭕️";

  const formattedDate = new Date(dueDateTime).toLocaleDateString("de-AT");

  const avatarId = assigneeEmployee?.avatarImage?.id;
  const avatarUrl = avatarId
    ? `https://app-app-nightly-be-vcur.azurewebsites.net/api/v1/images/resort-409a24db-159d-4455-80ab-057a23ba4728/${avatarId}/downloadtoken-271f8d09-c3b3-428c-ab50-ce0fdce5ca43`
    : null;

  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/task-detail",
      params: { task: JSON.stringify(task) }, // oder nur task.id, je nach Architektur
    });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {statusIcon} {taskName}
          </Text>
          <Text style={styles.progress}>{progress}</Text>
        </View>
        <Text style={styles.path}>{path}</Text>

        <View style={styles.footer}>
          {avatarUrl && (
            <Image source={{ uri: avatarUrl }} style={styles.avatar} />
          )}
          <Text style={styles.date}>{formattedDate}</Text>
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
});
