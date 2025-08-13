import { Link, router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import AppointmentChat from "../../components/AppointmentChat";
import ChatNotificationBadge from "../../components/ChatNotificationBadge";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";

export default function PatientDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { appointments } = useAppSelector((state) => state.appointments);
  const dispatch = useAppDispatch();
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);

  if (!user || user.role !== "patient") {
    return <Link href="/welcome" replace />;
  }

  // Filter appointments for current patient only
  const myAppointments = (appointments || []).filter(
    (apt) => apt.clientEmail === user.email
  );

  const upcomingAppointments = myAppointments.filter(
    (apt) =>
      apt.date >= new Date().toISOString().split("T")[0] &&
      apt.status === "scheduled"
  );

  const completedAppointments = myAppointments.filter(
    (apt) => apt.status === "completed"
  );

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/welcome");
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
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-500 pt-12 pb-6 px-4">
        <View className="flex-row justify-between items-start mb-4">
          <View>
            <Text className="text-white text-2xl font-bold mb-1">
              Hello, {user.name}
            </Text>
            <Text className="text-green-100">Patient Dashboard</Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white/20 px-4 py-2 rounded-lg"
          >
            <Text className="text-white font-semibold">Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between">
          <View className="bg-white/20 rounded-lg p-3 flex-1 mr-2">
            <Text className="text-white text-lg font-semibold">
              {upcomingAppointments?.length || 0}
            </Text>
            <Text className="text-white/80">Upcoming</Text>
          </View>
          <View className="bg-white/20 rounded-lg p-3 flex-1 mx-1">
            <Text className="text-white text-lg font-semibold">
              {completedAppointments?.length || 0}
            </Text>
            <Text className="text-white/80">Completed</Text>
          </View>
          <View className="bg-white/20 rounded-lg p-3 flex-1 ml-2">
            <Text className="text-white text-lg font-semibold">
              {user.pets?.length || 0}
            </Text>
            <Text className="text-white/80">My Pets</Text>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Quick Actions
        </Text>
        <View className="space-y-3">
          <Link href="/(main)/book-appointment" asChild>
            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
              <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">📅</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">
                  Book Appointment
                </Text>
                <Text className="text-gray-600 text-sm">
                  Schedule with available doctors
                </Text>
              </View>
              <Text className="text-green-500 font-semibold">→</Text>
            </TouchableOpacity>
          </Link>

          <Link href="/(main)/appointments" asChild>
            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
              <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">📋</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">
                  My Appointments
                </Text>
                <Text className="text-gray-600 text-sm">
                  View your appointment history
                </Text>
              </View>
              <Text className="text-green-500 font-semibold">→</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
            <View className="w-12 h-12 bg-purple-100 rounded-lg items-center justify-center mr-4">
              <Text className="text-2xl">🏥</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">
                Medical Records
              </Text>
              <Text className="text-gray-600 text-sm">
                View your health information
              </Text>
            </View>
            <Text className="text-green-500 font-semibold">→</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
            <View className="w-12 h-12 bg-orange-100 rounded-lg items-center justify-center mr-4">
              <Text className="text-2xl">👤</Text>
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-800">
                Profile Settings
              </Text>
              <Text className="text-gray-600 text-sm">
                Update your personal information
              </Text>
            </View>
            <Text className="text-green-500 font-semibold">→</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Upcoming Appointments */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Upcoming Appointments
        </Text>
        {(upcomingAppointments?.length || 0) === 0 ? (
          <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
            <Text className="text-gray-500 mb-3">No upcoming appointments</Text>
            <Link href="/book-appointment" asChild>
              <TouchableOpacity className="bg-green-500 px-4 py-2 rounded-lg">
                <Text className="text-white font-semibold">
                  Book Your First Appointment
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        ) : (
          <View className="space-y-3">
            {upcomingAppointments.slice(0, 3).map((appointment) => (
              <View
                key={appointment.id}
                className="bg-white p-4 rounded-lg border border-gray-200"
              >
                <View className="flex-row justify-between items-start mb-2">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {appointment.title}
                    </Text>
                    <Text className="text-gray-600 text-sm mb-1">
                      {appointment.date}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {appointment.serviceType} • {appointment.duration} min
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-green-600 font-medium mb-2">
                      {appointment.time}
                    </Text>
                    <TouchableOpacity
                      onPress={() => openChat(appointment.id)}
                      className="bg-blue-500 px-3 py-1 rounded-full relative"
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
      </View>

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
    </ScrollView>
  );
}
