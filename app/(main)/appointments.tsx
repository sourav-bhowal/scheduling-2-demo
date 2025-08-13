import { Link } from "expo-router";
import { useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentChat from "../../components/AppointmentChat";
import ChatNotificationBadge from "../../components/ChatNotificationBadge";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setFilters,
  updateAppointmentStatus,
} from "../../store/slices/appointmentsSlice";

export default function Appointments() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { appointments, filters } = useAppSelector(
    (state) => state.appointments
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  // Filter appointments based on current filters and search
  const filteredAppointments = (appointments || []).filter((apt) => {
    if (!apt) return false; // Additional safety check
    const matchesSearch =
      (apt.clientName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (apt.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filters.status === "all" || apt.status === filters.status;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (
    appointmentId: string,
    newStatus: "scheduled" | "completed" | "cancelled"
  ) => {
    dispatch(updateAppointmentStatus({ id: appointmentId, status: newStatus }));
  };

  const handleFilterChange = (
    status: "all" | "scheduled" | "completed" | "cancelled"
  ) => {
    dispatch(setFilters({ status }));
  };

  const openChat = (appointmentId: string) => {
    setSelectedAppointmentId(appointmentId);
    setChatModalVisible(true);
  };

  const closeChat = () => {
    setChatModalVisible(false);
    setSelectedAppointmentId(null);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="relative flex-1">
        {/* Header */}
        <View className="bg-white px-4 py-3 border-b border-gray-200">
          <Text className="text-xl font-bold text-gray-900 mb-3">
            All Appointments
          </Text>

          {/* Search */}
          <TextInput
            className="bg-gray-100 px-4 py-3 rounded-lg mb-3"
            placeholder="Search appointments..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* Filter Buttons */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row justify-between w-full">
              {(["all", "scheduled", "completed", "cancelled"] as const).map(
                (status) => (
                  <TouchableOpacity
                    key={status}
                    onPress={() => handleFilterChange(status)}
                    className={`px-4 py-2 rounded-full ${
                      filters.status === status ? "bg-blue-500" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`capitalize ${
                        filters.status === status
                          ? "text-white"
                          : "text-gray-700"
                      }`}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </ScrollView>
        </View>

        {/* Appointments List */}
        <ScrollView className="flex-1 px-4 py-4">
          {filteredAppointments.length === 0 ? (
            <View className="flex-1 items-center justify-center py-20">
              <Text className="text-gray-500 text-lg">
                No appointments found
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {filteredAppointments
                .sort(
                  (a, b) =>
                    new Date(a.date + " " + a.time).getTime() -
                    new Date(b.date + " " + b.time).getTime()
                )
                .map((appointment) => (
                  <View
                    key={appointment.id}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                  >
                    <View className="flex-row justify-between items-start mb-2">
                      <View className="flex-1">
                        <Text className="text-lg font-semibold text-gray-900">
                          {appointment.title}
                        </Text>
                        <Text className="text-gray-600">
                          {appointment.clientName}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          {appointment.clientPhone}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-sm text-blue-600 font-medium">
                          {appointment.date}
                        </Text>
                        <Text className="text-sm text-blue-600 font-medium">
                          {appointment.time}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-500 text-sm mb-3">
                      {appointment.description}
                    </Text>

                    <View className="flex-row justify-between items-center">
                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() =>
                            handleStatusChange(appointment.id, "scheduled")
                          }
                          className={`px-3 py-1 rounded-full ${
                            appointment.status === "scheduled"
                              ? "bg-blue-500"
                              : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              appointment.status === "scheduled"
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            Scheduled
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleStatusChange(appointment.id, "completed")
                          }
                          className={`px-3 py-1 rounded-full ${
                            appointment.status === "completed"
                              ? "bg-green-500"
                              : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              appointment.status === "completed"
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            Completed
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            handleStatusChange(appointment.id, "cancelled")
                          }
                          className={`px-3 py-1 rounded-full ${
                            appointment.status === "cancelled"
                              ? "bg-red-500"
                              : "bg-gray-200"
                          }`}
                        >
                          <Text
                            className={`text-xs ${
                              appointment.status === "cancelled"
                                ? "text-white"
                                : "text-gray-700"
                            }`}
                          >
                            Cancelled
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View className="flex-row items-center space-x-2">
                        {appointment.price && (
                          <Text className="text-gray-900 font-semibold">
                            ${appointment.price}
                          </Text>
                        )}
                        <TouchableOpacity
                          onPress={() => openChat(appointment.id)}
                          className="bg-green-500 px-3 py-1 rounded-full relative"
                        >
                          <Text className="text-white text-xs font-medium">
                            💬 Chat
                          </Text>
                          {user && (
                            <ChatNotificationBadge
                              appointmentId={appointment.id}
                              currentUserId={user.id}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                ))}
            </View>
          )}
        </ScrollView>

        {/* Chat Modal */}
        <Modal
          visible={chatModalVisible}
          animationType="slide"
          presentationStyle="fullScreen"
        >
          {selectedAppointmentId && (
            <AppointmentChat
              appointmentId={selectedAppointmentId}
              onClose={closeChat}
            />
          )}
        </Modal>

        {/* Bottom Navigation */}
        <View className="flex-row absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3">
          <Link href="/" asChild>
            <TouchableOpacity className="flex-1 bg-gray-100 mr-2 py-3 rounded-lg">
              <Text className="text-center font-semibold text-gray-700">
                Home
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(main)/create-appointment" asChild>
            <TouchableOpacity className="flex-1 bg-blue-500 ml-2 py-3 rounded-lg">
              <Text className="text-center font-semibold text-white">
                New Appointment
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}
