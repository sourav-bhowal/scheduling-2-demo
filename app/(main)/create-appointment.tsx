import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import CustomDatePicker from "../../components/CustomDatePicker";
import TimePicker from "../../components/TimePicker";
import { useAppDispatch } from "../../store/hooks";
import {
  addAppointment,
  Appointment,
} from "../../store/slices/appointmentsSlice";

export default function CreateAppointment() {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    time: "10:00",
    clientName: "",
    clientPhone: "",
    clientEmail: "",
    serviceType: "",
    duration: "60",
    price: "",
    notes: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.clientName || !formData.clientPhone) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      clientName: formData.clientName,
      clientPhone: formData.clientPhone,
      clientEmail: formData.clientEmail,
      status: "scheduled",
      serviceType: formData.serviceType,
      duration: parseInt(formData.duration) || 60,
      price: formData.price ? parseFloat(formData.price) : undefined,
      notes: formData.notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      doctorId: "",
      doctorName: "",
    };

    dispatch(addAppointment(newAppointment));
    Alert.alert("Success", "Appointment created successfully!", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-4 py-4">
        <View className="bg-white rounded-lg p-4 mb-4">
          <Text className="text-xl font-bold text-gray-900 mb-4">
            Create New Appointment
          </Text>

          {/* Title */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Title *</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="Appointment title"
              value={formData.title}
              onChangeText={(value) => handleInputChange("title", value)}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Description</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="Appointment description"
              value={formData.description}
              onChangeText={(value) => handleInputChange("description", value)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Date and Time */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <CustomDatePicker
                value={formData.date}
                onDateChange={(date) => handleInputChange("date", date)}
                label="Date"
                placeholder="Select date"
                minimumDate={new Date()}
              />
            </View>
            <View className="flex-1 ml-2">
              <TimePicker
                value={formData.time}
                onTimeChange={(time) => handleInputChange("time", time)}
                label="Time"
                placeholder="Select time"
              />
            </View>
          </View>

          {/* Client Name */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
              Client Name *
            </Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="Client full name"
              value={formData.clientName}
              onChangeText={(value) => handleInputChange("clientName", value)}
            />
          </View>

          {/* Client Phone */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">
              Client Phone *
            </Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="Phone number"
              value={formData.clientPhone}
              onChangeText={(value) => handleInputChange("clientPhone", value)}
              keyboardType="phone-pad"
            />
          </View>

          {/* Client Email */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Client Email</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="Email address"
              value={formData.clientEmail}
              onChangeText={(value) => handleInputChange("clientEmail", value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Service Type */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Service Type</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="e.g., Haircut, Consultation"
              value={formData.serviceType}
              onChangeText={(value) => handleInputChange("serviceType", value)}
            />
          </View>

          {/* Duration and Price */}
          <View className="flex-row mb-4">
            <View className="flex-1 mr-2">
              <Text className="text-gray-700 font-medium mb-2">
                Duration (minutes)
              </Text>
              <TextInput
                className="bg-gray-100 px-4 py-3 rounded-lg"
                placeholder="60"
                value={formData.duration}
                onChangeText={(value) => handleInputChange("duration", value)}
                keyboardType="numeric"
              />
            </View>
            <View className="flex-1 ml-2">
              <Text className="text-gray-700 font-medium mb-2">Price ($)</Text>
              <TextInput
                className="bg-gray-100 px-4 py-3 rounded-lg"
                placeholder="0.00"
                value={formData.price}
                onChangeText={(value) => handleInputChange("price", value)}
                keyboardType="numeric"
              />
            </View>
          </View>

          {/* Notes */}
          <View className="mb-4">
            <Text className="text-gray-700 font-medium mb-2">Notes</Text>
            <TextInput
              className="bg-gray-100 px-4 py-3 rounded-lg"
              placeholder="Additional notes"
              value={formData.notes}
              onChangeText={(value) => handleInputChange("notes", value)}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View className="flex-row bg-white border-t border-gray-200 px-4 py-3">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 bg-gray-100 mr-2 py-3 rounded-lg"
        >
          <Text className="text-center font-semibold text-gray-700">
            Cancel
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          className="flex-1 bg-blue-500 ml-2 py-3 rounded-lg"
        >
          <Text className="text-center font-semibold text-white">
            Create Appointment
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
