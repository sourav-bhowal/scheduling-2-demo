import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface TimePickerProps {
  value: string; // Time string in HH:MM format
  onTimeChange: (time: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
}

export default function TimePicker({
  value,
  onTimeChange,
  placeholder = "Select time",
  label,
  required = false,
}: TimePickerProps) {
  const [show, setShow] = useState(false);

  // Convert time string to Date object (using today's date)
  const getTimeAsDate = (timeString: string) => {
    const today = new Date();
    if (timeString) {
      const [hours, minutes] = timeString.split(":").map(Number);
      today.setHours(hours, minutes, 0, 0);
    }
    return today;
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return placeholder;

    const [hours, minutes] = timeString.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes);

    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const onChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedTime) {
      const formattedTime = formatTime(selectedTime);
      onTimeChange(formattedTime);
    }

    if (Platform.OS === "ios" && event.type === "dismissed") {
      setShow(false);
    }
  };

  const showTimePicker = () => {
    setShow(true);
  };

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={showTimePicker}
        className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
      >
        <Text className={`${value ? "text-gray-900" : "text-gray-500"}`}>
          {formatDisplayTime(value)}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="timePicker"
          value={getTimeAsDate(value)}
          mode="time"
          is24Hour={false}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
        />
      )}

      {Platform.OS === "ios" && show && (
        <TouchableOpacity
          onPress={() => setShow(false)}
          className="mt-2 bg-blue-500 py-2 px-4 rounded-lg"
        >
          <Text className="text-white text-center font-medium">Done</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
