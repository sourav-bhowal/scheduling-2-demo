import React, { useEffect, useRef } from "react";
import {
  Animated,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface RoleSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectRole: (role: "doctor" | "patient") => void;
}

export default function RoleSelectionModal({
  visible,
  onClose,
  onSelectRole,
}: RoleSelectionModalProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, fadeAnim, scaleAnim]);

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <Animated.View
        style={{ opacity: fadeAnim }}
        className="flex-1 justify-center items-center bg-black/60"
      >
        <Pressable className="absolute inset-0" onPress={onClose} />

        <Animated.View
          style={{ transform: [{ scale: scaleAnim }] }}
          className="bg-blue-500 rounded-3xl mx-6 p-8 shadow-2xl min-w-[320px] max-w-[400px] flex flex-col gap-10"
        >
          {/* Header */}
          <View className="items-center">
            <View className="w-16 h-16 bg-white rounded-2xl items-center justify-center mb-4">
              <Text className="text-2xl">🏥</Text>
            </View>
            <Text className="text-2xl font-bold text-white mb-2">
              Choose Your Role
            </Text>
            <Text className="text-white text-center text-base">
              Select how you&apos;d like to use MedSchedule
            </Text>
          </View>

          {/* Role Options */}
          <View className="flex flex-col gap-2">
            {/* Doctor Option */}
            <TouchableOpacity
              onPress={() => onSelectRole("doctor")}
              className="bg-white rounded-2xl text-black p-5 shadow-lg active:scale-95"
            >
              <View className="flex-row items-center">
                <View className="w-14 h-14  rounded-xl items-center justify-center mr-4">
                  <Text className="text-2xl">👨‍⚕️</Text>
                </View>
                <View className="flex-1">
                  <Text className=" text-lg font-bold">
                    Doctor
                  </Text>
                  <Text className=" text-sm mt-1">
                    Manage patients & appointments
                  </Text>
                </View>
                <View className="w-8 h-8 rounded-full items-center justify-center">
                  <Text className=" font-bold">→</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Patient Option */}
            <TouchableOpacity
              onPress={() => onSelectRole("patient")}
              className="bg-white text-black rounded-2xl p-5  active:scale-95"
            >
              <View className="flex-row items-center">
                <View className="w-14 h-14  rounded-xl items-center justify-center mr-4">
                  <Text className="text-2xl">🧑‍🦽</Text>
                </View>
                <View className="flex-1">
                  <Text className=" text-lg font-bold">Patient</Text>
                  <Text className="text-sm mt-1">
                    Book & manage appointments
                  </Text>
                </View>
                <View className="w-8 h-8  rounded-full items-center justify-center">
                  <Text className=" font-bold">→</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={onClose}
            className="py-4 px-6 bg-white rounded-2xl active:bg-gray-200"
          >
            <Text className="text-red-500 text-center font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
