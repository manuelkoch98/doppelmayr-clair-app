import { Drawer } from "expo-router/drawer";

export default function DrawerLayout() {
  return (
    <Drawer>
      <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
      <Drawer.Screen name="contact-sales" options={{ title: "Contact Sales" }} />
      <Drawer.Screen name="release-notes" options={{ title: "Release Notes" }} />
    </Drawer>
  );
}
