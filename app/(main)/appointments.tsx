import { Link } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setFilters,
  updateAppointmentStatus,
} from "../../store/slices/appointmentsSlice";

export default function Appointments() {
  const dispatch = useAppDispatch();
  const { appointments, filters } = useAppSelector(
    (state) => state.appointments
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Filter appointments based on current filters and search
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.title.toLowerCase().includes(searchQuery.toLowerCase());
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

  return (
    <View className="flex-1 bg-gray-50">
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
          <View className="flex-row space-x-2">
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
                      filters.status === status ? "text-white" : "text-gray-700"
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
            <Text className="text-gray-500 text-lg">No appointments found</Text>
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
                    {appointment.price && (
                      <Text className="text-gray-900 font-semibold">
                        ${appointment.price}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View className="flex-row bg-white border-t border-gray-200 px-4 py-3">
        <Link href="/" asChild>
          <TouchableOpacity className="flex-1 bg-gray-100 mr-2 py-3 rounded-lg">
            <Text className="text-center font-semibold text-gray-700">
              Home
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href="/create-appointment" asChild>
          <TouchableOpacity className="flex-1 bg-blue-500 ml-2 py-3 rounded-lg">
            <Text className="text-center font-semibold text-white">
              New Appointment
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
