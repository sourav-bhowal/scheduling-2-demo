import { Link, router } from "expo-router";
import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppointmentChat from "../../components/AppointmentChat";
import ChatNotificationBadge from "../../components/ChatNotificationBadge";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { logout } from "../../store/slices/authSlice";

export default function DoctorDashboard() {
  const { user, doctorSlots } = useAppSelector((state) => state.auth);
  const { appointments } = useAppSelector((state) => state.appointments);
  const dispatch = useAppDispatch();
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<
    string | null
  >(null);

  if (!user || user.role !== "doctor") {
    return <Link href="/(main)/welcome" replace />;
  }

  // Filter appointments for current doctor only
  const myAppointments = (appointments || []).filter(
    (apt) => apt.doctorId === user.id
  );

  const todayAppointments = myAppointments.filter(
    (apt) =>
      apt.date === new Date().toISOString().split("T")[0] &&
      apt.status === "scheduled"
  );

  const upcomingAppointments = myAppointments.filter(
    (apt) => new Date(apt.date) > new Date() && apt.status === "scheduled"
  );

  const completedAppointments = myAppointments.filter(
    (apt) => apt.status === "completed"
  );

  const handleLogout = () => {
    dispatch(logout());
    router.replace("/(main)/welcome");
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
      <ScrollView className="">
        {/* Header */}
        <View className="bg-blue-500 pt-12 pb-6 px-4">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-white text-2xl font-bold mb-1">
                Welcome, Dr. {user.name?.split(" ").slice(1).join(" ")}
              </Text>
              <Text className="text-blue-100">{user.petSpecialization}</Text>
              <Text className="text-blue-100">{user.clinicName}</Text>
            </View>
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-white/20 px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-semibold">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between mb-3">
            <View className="bg-white/20 rounded-lg p-3 flex-1 mr-2">
              <Text className="text-white text-lg font-semibold">
                {todayAppointments?.length || 0}
              </Text>
              <Text className="text-white/80">Today</Text>
            </View>
            <View className="bg-white/20 rounded-lg p-3 flex-1 ml-2">
              <Text className="text-white text-lg font-semibold">
                {upcomingAppointments?.length || 0}
              </Text>
              <Text className="text-white/80">Upcoming</Text>
            </View>
          </View>
          <View className="flex-row justify-between">
            <View className="bg-white/20 rounded-lg p-3 flex-1 mr-2">
              <Text className="text-white text-lg font-semibold">
                {completedAppointments?.length || 0}
              </Text>
              <Text className="text-white/80">Completed</Text>
            </View>
            <View className="bg-white/20 rounded-lg p-3 flex-1 ml-2">
              <Text className="text-white text-lg font-semibold">
                {
                  (doctorSlots || []).filter(
                    (slot) => slot.doctorId === user.id && slot.isAvailable
                  ).length
                }
              </Text>
              <Text className="text-white/80">Available Slots</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Quick Actions
          </Text>
          <View className="flex flex-col gap-3">
            <Link href="/manage-availability" asChild>
              <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
                <View className="w-12 h-12 bg-blue-100 rounded-lg items-center justify-center mr-4">
                  <Text className="text-2xl">📅</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    Manage Availability
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Set your available time slots
                  </Text>
                </View>
                <Text className="text-blue-500 font-semibold">→</Text>
              </TouchableOpacity>
            </Link>

            <Link href="/appointments" asChild>
              <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
                <View className="w-12 h-12 bg-green-100 rounded-lg items-center justify-center mr-4">
                  <Text className="text-2xl">👥</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    View All Appointments
                  </Text>
                  <Text className="text-gray-600 text-sm">
                    Manage your appointment schedule
                  </Text>
                </View>
                <Text className="text-blue-500 font-semibold">→</Text>
              </TouchableOpacity>
            </Link>

            <TouchableOpacity className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex-row items-center">
              <View className="w-12 h-12 bg-purple-100 rounded-lg items-center justify-center mr-4">
                <Text className="text-2xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800">
                  Update Profile
                </Text>
                <Text className="text-gray-600 text-sm">
                  Edit your professional information
                </Text>
              </View>
              <Text className="text-blue-500 font-semibold">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Today's Appointments */}
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Today&apos;s Appointments
          </Text>
          {todayAppointments?.length === 0 ? (
            <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
              <Text className="text-gray-500">
                No appointments scheduled for today
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {todayAppointments.slice(0, 3).map((appointment) => (
                <View
                  key={appointment.id}
                  className="bg-white p-4 rounded-lg border border-gray-200"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800">
                        {appointment.clientName}
                      </Text>
                      <Text className="text-gray-600 text-sm mb-1">
                        {appointment.title}
                      </Text>
                      <Text className="text-gray-500 text-xs">
                        {appointment.serviceType} • {appointment.duration} min
                      </Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-blue-600 font-medium mb-2">
                        {appointment.time}
                      </Text>
                      <TouchableOpacity
                        onPress={() => openChat(appointment.id)}
                        className="bg-green-500 px-3 py-1 rounded-full relative"
                      >
                        <Text className="text-white text-xs font-medium">
                          💬 Chat
                        </Text>
                        <ChatNotificationBadge
                          appointmentId={appointment.id}
                          currentUserId={user.id}
                        />
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
    </SafeAreaView>
  );
}
