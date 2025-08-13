import { Text, View } from "react-native";
import { useAppSelector } from "../store/hooks";

interface ChatNotificationBadgeProps {
  appointmentId: string;
  currentUserId: string;
}

export default function ChatNotificationBadge({
  appointmentId,
  currentUserId,
}: ChatNotificationBadgeProps) {
  const { chatMessages } = useAppSelector((state) => state.appointments);

  const unreadCount = chatMessages?.filter(
    (msg) =>
      msg.appointmentId === appointmentId &&
      msg.senderId !== currentUserId &&
      !msg.isRead
  )?.length;

  if (unreadCount === 0) {
    return null;
  }

  return (
    <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 items-center justify-center">
      <Text className="text-white text-xs font-bold">
        {unreadCount > 9 ? "9+" : unreadCount}
      </Text>
    </View>
  );
}
