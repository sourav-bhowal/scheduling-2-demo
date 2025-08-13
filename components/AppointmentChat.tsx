import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  addChatMessage,
  ChatMessage,
  markMessagesAsRead,
} from "../store/slices/appointmentsSlice";

interface AppointmentChatProps {
  appointmentId: string;
  onClose: () => void;
}

export default function AppointmentChat({
  appointmentId,
  onClose,
}: AppointmentChatProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, chatMessages } = useAppSelector(
    (state) => state.appointments
  );

  const [message, setMessage] = useState("");

  const appointment = appointments.find((apt) => apt.id === appointmentId);
  const appointmentMessages = chatMessages
    .filter((msg) => msg.appointmentId === appointmentId)
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

  useEffect(() => {
    if (user && appointmentId) {
      dispatch(markMessagesAsRead({ appointmentId, userId: user.id }));
    }
  }, [appointmentId, user, dispatch]);

  const sendMessage = () => {
    if (!message.trim() || !user || !appointment) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      appointmentId,
      senderId: user.id,
      senderName: user.name,
      senderRole: user.role,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };

    dispatch(addChatMessage(newMessage));
    setMessage("");
  };

  const otherParticipant =
    user?.role === "doctor"
      ? { name: appointment?.clientName, role: "patient" as const }
      : { name: appointment?.doctorName, role: "doctor" as const };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-4 px-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-lg font-bold">
            Chat with {otherParticipant.name}
          </Text>
          <Text className="text-blue-100 text-sm">
            {appointment?.petName
              ? `About ${appointment.petName}`
              : "Veterinary Consultation"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={onClose}
          className="bg-blue-600 rounded-full w-8 h-8 items-center justify-center"
        >
          <Text className="text-white font-bold">×</Text>
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 px-4 py-2">
        {appointmentMessages.length === 0 ? (
          <View className="flex-1 items-center justify-center py-8">
            <Text className="text-gray-500 text-center">
              Start a conversation with {otherParticipant.name}
            </Text>
            <Text className="text-gray-400 text-sm text-center mt-2">
              Ask questions about the appointment or share updates
            </Text>
          </View>
        ) : (
          appointmentMessages.map((msg) => (
            <View
              key={msg.id}
              className={`mb-4 ${msg.senderId === user?.id ? "items-end" : "items-start"}`}
            >
              <View
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                  msg.senderId === user?.id
                    ? "bg-blue-500 rounded-br-md"
                    : "bg-gray-200 rounded-bl-md"
                }`}
              >
                <Text
                  className={`${
                    msg.senderId === user?.id ? "text-white" : "text-gray-800"
                  }`}
                >
                  {msg.message}
                </Text>
              </View>
              <Text className="text-xs text-gray-500 mt-1 px-2">
                {msg.senderName} •{" "}
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Message Input */}
      <View className="border-t border-gray-200 p-4 flex-row items-center space-x-2">
        <TextInput
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 max-h-24"
          placeholder={`Message ${otherParticipant.name}...`}
          value={message}
          onChangeText={setMessage}
          multiline
          textAlignVertical="center"
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={!message.trim()}
          className={`w-12 h-12 rounded-full items-center justify-center ${
            message.trim() ? "bg-blue-500" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-lg">→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
