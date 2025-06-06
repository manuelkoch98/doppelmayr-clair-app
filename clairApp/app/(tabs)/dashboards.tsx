import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function DashboardScreen() {
  return (
    <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ThemedText type="title">Dashboards</ThemedText>
    </ThemedView>
  );
}
