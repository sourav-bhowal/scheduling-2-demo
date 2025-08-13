import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

interface EnhancedDateTimePickerProps {
  value: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  mode?: "date" | "time" | "datetime";
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
  style?: "default" | "shadcn";
}

export default function EnhancedDateTimePicker({
  value,
  onDateChange,
  placeholder = "Select date",
  label,
  mode = "date",
  minimumDate,
  maximumDate,
  required = false,
  style = "shadcn",
}: EnhancedDateTimePickerProps) {
  const [show, setShow] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const dateValue = value ? new Date(value) : new Date();

  const formatDate = (date: Date) => {
    if (mode === "date") {
      return date.toISOString().split("T")[0];
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
        weekday: "short",
        year: "numeric",
        month: "short",
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
      return date.toLocaleString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    }
  };

  const onChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      setModalVisible(false);
    }

    if (event.type === "set" && selectedDate) {
      const formattedDate = formatDate(selectedDate);
      onDateChange(formattedDate);
    }

    if (Platform.OS === "ios" && event.type === "dismissed") {
      setShow(false);
      setModalVisible(false);
    }
  };

  const showDatePicker = () => {
    if (Platform.OS === "ios") {
      setModalVisible(true);
    }
    setShow(true);
  };

  const getIcon = () => {
    if (mode === "time") {
      return "🕐";
    } else if (mode === "datetime") {
      return "📅⏰";
    } else {
      return "📅";
    }
  };

  const getShadcnStyles = () => {
    if (style === "shadcn") {
      return {
        container:
          "border border-gray-300 rounded-md shadow-sm hover:border-gray-400 transition-colors duration-200",
        button:
          "flex flex-row items-center justify-between px-3 py-2 min-h-[44px] bg-white",
        text: value ? "text-gray-900 font-medium" : "text-gray-500",
        label: "text-sm font-medium text-gray-900 mb-1.5",
      };
    }
    return {
      container: "bg-gray-50 border border-gray-300 rounded-lg",
      button: "px-4 py-3",
      text: value ? "text-gray-900" : "text-gray-500",
      label: "text-sm font-medium text-gray-700 mb-2",
    };
  };

  const styles = getShadcnStyles();

  const renderIOSModal = () => (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setModalVisible(false);
        setShow(false);
      }}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-xl p-4">
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setShow(false);
              }}
              className="px-4 py-2"
            >
              <Text className="text-blue-500 text-lg font-medium">Cancel</Text>
            </TouchableOpacity>

            <Text className="text-lg font-semibold text-gray-900">
              {mode === "time" ? "Select Time" : "Select Date"}
            </Text>

            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setShow(false);
              }}
              className="px-4 py-2"
            >
              <Text className="text-blue-500 text-lg font-medium">Done</Text>
            </TouchableOpacity>
          </View>

          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={dateValue}
              mode={mode}
              is24Hour={mode === "time" ? false : true}
              display="spinner"
              onChange={onChange}
              minimumDate={minimumDate}
              maximumDate={maximumDate}
              style={{ backgroundColor: "white" }}
            />
          )}
        </View>
      </View>
    </Modal>
  );

  return (
    <View>
      {label && (
        <Text className={styles.label}>
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <View className={styles.container}>
        <TouchableOpacity onPress={showDatePicker} className={styles.button}>
          <View className="flex-row items-center flex-1">
            <Text className="text-lg mr-3">{getIcon()}</Text>
            <Text className={styles.text}>{formatDisplayDate(value)}</Text>
          </View>
          <Text className="text-gray-400 text-lg">▼</Text>
        </TouchableOpacity>
      </View>

      {Platform.OS === "android" && show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateValue}
          mode={mode}
          is24Hour={mode === "time" ? false : true}
          display="default"
          onChange={onChange}
          minimumDate={minimumDate}
          maximumDate={maximumDate}
        />
      )}

      {Platform.OS === "ios" && renderIOSModal()}
    </View>
  );
}
