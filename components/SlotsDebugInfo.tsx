import React from "react";
import { Text, View } from "react-native";
import { useAppSelector } from "../store/hooks";

export default function SlotsDebugInfo() {
  const { registeredUsers, doctorSlots, user, isAuthenticated } =
    useAppSelector((state) => state.auth);

  const doctors = registeredUsers?.filter((u) => u.role === "doctor") || [];

  return (
    <View className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg m-4">
      <Text className="font-bold text-yellow-800 mb-2">
        Debug Info - Time Slots
      </Text>

      <Text className="text-sm text-yellow-700 mb-1">
        Current User: {user?.name || "None"} ({user?.role || "N/A"}) - Auth:{" "}
        {isAuthenticated ? "Yes" : "No"}
      </Text>

      <Text className="text-sm text-yellow-700 mb-1">
        Registered Doctors: {doctors.length}
      </Text>

      <Text className="text-sm text-yellow-700 mb-1">
        Total Doctor Slots: {doctorSlots.length}
      </Text>

      {doctors.length > 0 && (
        <View className="mt-2">
          <Text className="text-xs font-semibold text-yellow-800 mb-1">
            Doctors:
          </Text>
          {doctors.map((doctor) => (
            <Text key={doctor.id} className="text-xs text-yellow-600">
              • {doctor.name} (ID: {doctor.id.slice(-6)})
            </Text>
          ))}
        </View>
      )}

      {doctorSlots.length > 0 && (
        <View className="mt-2">
          <Text className="text-xs font-semibold text-yellow-800 mb-1">
            Available Slots:
          </Text>
          {doctorSlots.map((slot) => (
            <Text key={slot.id} className="text-xs text-yellow-600">
              • {slot.date} {slot.startTime}-{slot.endTime} (Doctor:{" "}
              {slot.doctorId.slice(-6)}, Available:{" "}
              {slot.isAvailable ? "Yes" : "No"})
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
