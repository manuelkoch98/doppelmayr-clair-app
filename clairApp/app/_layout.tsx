import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { AuthProvider, AuthContext } from "@/contexts/AuthContext";
import { useContext } from "react";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <AuthProvider>
      <RootNavigation colorScheme={colorScheme} />
    </AuthProvider>
  );
}

import type { ColorSchemeName } from "react-native";

function RootNavigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  const { token } = useContext(AuthContext);
  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack>
        {token ? (
          <Stack.Screen name="(drawer)" options={{ headerShown: false }} />
        ) : (
          <Stack.Screen name="login" options={{ headerShown: false }} />
        )}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
