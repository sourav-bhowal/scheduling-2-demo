import { useAppSelector } from "@/store/hooks";
import { Text, View } from "react-native";

export default function AuthDebugInfo({ show = false }: { show?: boolean }) {
  const { user, isAuthenticated, loading, error, registeredUsers } = useAppSelector((state) => state.auth);

  if (!show) return null;

  return (
    <View className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 m-4">
      <Text className="font-bold text-yellow-800 mb-2">🐛 DEBUG INFO</Text>
      <Text className="text-xs text-yellow-700">Loading: {loading ? "Yes" : "No"}</Text>
      <Text className="text-xs text-yellow-700">Authenticated: {isAuthenticated ? "Yes" : "No"}</Text>
      <Text className="text-xs text-yellow-700">Current User: {user ? `${user.name} (${user.role})` : "None"}</Text>
      <Text className="text-xs text-yellow-700">Registered Users: {registeredUsers?.length || 0}</Text>
      {registeredUsers?.length > 0 && (
        <View className="mt-1">
          <Text className="text-xs text-yellow-700 font-medium">Users:</Text>
          {registeredUsers.map((regUser, index) => (
            <Text key={regUser.id} className="text-xs text-yellow-600 ml-2">
              {index + 1}. {regUser.email} ({regUser.role})
            </Text>
          ))}
        </View>
      )}
      {error && <Text className="text-xs text-red-600 mt-1">Error: {error}</Text>}
    </View>
  );
}
