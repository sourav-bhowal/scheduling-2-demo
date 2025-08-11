import { Text, View } from "react-native";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-100">
      <Text className="text-red-500 text-2xl font-bold">
        Tailwind test: red & bold text.
      </Text>
      <Text className="mt-4 text-blue-600">
        If this is not styled, NativeWind isn&apos;t running.
      </Text>
    </View>
  );
}
