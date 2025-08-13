import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

interface CustomDatePickerProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onDateChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
}

export default function CustomDatePicker({
  value,
  onDateChange,
  placeholder = "Select date",
  label,
  mode = "date",
  minimumDate,
  maximumDate,
  required = false,
}: CustomDatePickerProps) {
  const [show, setShow] = useState(false);

  // Convert string value to Date object
  const dateValue = value ? new Date(value) : new Date();

  const formatDate = (date: Date) => {
    if (mode === "date") {
      return date.toISOString().split("T")[0]; // YYYY-MM-DD
    } else if (mode === "time") {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      return date.toISOString();
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;

    if (mode === "date") {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } else if (mode === "time") {
      const [hours, minutes] = dateString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes);
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else {
      const date = new Date(dateString);
      return date.toLocaleString();
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
    }

    if (event.type === "set" && selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);
    }

    if (Platform.OS === "ios" && event.type === "dismissed") {
      setShow(false);
    }
  };

  const showDatePicker = () => {
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
        onPress={showDatePicker}
        className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
      >
        <Text className={`${value ? "text-gray-900" : "text-gray-500"}`}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateValue}
          mode={mode}
          is24Hour={mode === "time"}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
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
