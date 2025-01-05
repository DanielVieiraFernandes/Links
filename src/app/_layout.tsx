import { colors } from "@/styles/colors";
import { Stack } from "expo-router";

export default function Layout() {
  const backgroundColor = colors.gray[950];

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor,
        },
      }}
    />
  );
}
