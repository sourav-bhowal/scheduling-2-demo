import { store } from "../store";
import { addChatMessage, ChatMessage } from "../store/slices/appointmentsSlice";

/**
 * Utility function to send a test chat message for demonstration
 */
export const sendTestMessage = (
  appointmentId: string,
  senderId: string,
  senderName: string,
  senderRole: "doctor" | "patient",
  message: string
) => {
  const testMessage: ChatMessage = {
    id: Date.now().toString(),
    appointmentId,
    senderId,
    senderName,
    senderRole,
    message,
    timestamp: new Date().toISOString(),
    isRead: false,
  };

  store.dispatch(addChatMessage(testMessage));
};

/**
 * Utility to get unread message count for a user and appointment
 */
export const getUnreadMessageCount = (
  appointmentId: string,
  currentUserId: string,
  chatMessages: ChatMessage[]
): number => {
  return chatMessages.filter(
    (msg) =>
      msg.appointmentId === appointmentId &&
      msg.senderId !== currentUserId &&
      !msg.isRead
  ).length;
};


