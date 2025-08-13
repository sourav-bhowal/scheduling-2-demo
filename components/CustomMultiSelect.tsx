import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface MultiSelectOption {
  label: string;
  value: string;
}

interface CustomMultiSelectProps {
  options: MultiSelectOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  maxSelections?: number;
}

export default function CustomMultiSelect({
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Select options",
  label,
  required = false,
  disabled = false,
  maxSelections,
}: CustomMultiSelectProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleOption = (value: string) => {
    let newSelection = [...selectedValues];

    if (selectedValues.includes(value)) {
      newSelection = selectedValues.filter((v) => v !== value);
    } else {
      if (!maxSelections || selectedValues.length < maxSelections) {
        newSelection = [...selectedValues, value];
      }
    }

    onSelectionChange(newSelection);
  };

  const selectAll = () => {
    if (maxSelections && options.length > maxSelections) {
      onSelectionChange(
        options.slice(0, maxSelections).map((opt) => opt.value)
      );
    } else {
      onSelectionChange(options.map((opt) => opt.value));
    }
  };

  const clearAll = () => {
    onSelectionChange([]);
  };

  const openDropdown = () => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

  const allSelected = selectedValues.length === options.length;
  const noneSelected = selectedValues.length === 0;

  return (
    <View>
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label} {required && <Text className="text-red-500">*</Text>}
        </Text>
      )}

      <TouchableOpacity
        onPress={openDropdown}
        className={`bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex-row justify-between items-center ${
          disabled ? "opacity-50" : ""
        }`}
        disabled={disabled}
      >
        <View className="flex-1 flex-row flex-wrap gap-1">
          {selectedValues.length === 0 ? (
            <Text className="text-gray-500">{placeholder}</Text>
          ) : selectedValues.length <= 3 ? (
            selectedValues.map((value) => {
              const option = options.find((opt) => opt.value === value);
              return (
                <View
                  key={value}
                  className="bg-blue-100 px-2 py-1 rounded-full"
                >
                  <Text className="text-xs text-blue-800">
                    {option?.label || value}
                  </Text>
                </View>
              );
            })
          ) : (
            <View className="bg-blue-100 px-2 py-1 rounded-full">
              <Text className="text-xs text-blue-800">
                {selectedValues.length} selected
              </Text>
            </View>
          )}
        </View>
        <Ionicons name="chevron-down" size={20} color="#6B7280" />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-center items-center"
          activeOpacity={1}
          onPress={() => setIsVisible(false)}
        >
          <View className="bg-white rounded-lg m-4 max-h-96 w-80">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">
                {label || "Select Options"}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {selectedValues.length} of {options.length} selected
                {maxSelections && ` (max ${maxSelections})`}
              </Text>
            </View>

            {/* Action buttons */}
            <View className="flex-row border-b border-gray-200">
              <TouchableOpacity
                onPress={selectAll}
                className="flex-1 p-3 border-r border-gray-200"
                disabled={
                  allSelected ||
                  (maxSelections ? maxSelections < options.length : false)
                }
              >
                <Text
                  className={`text-center text-sm ${
                    allSelected ||
                    (maxSelections ? maxSelections < options.length : false)
                      ? "text-gray-400"
                      : "text-blue-600 font-medium"
                  }`}
                >
                  Select All
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={clearAll}
                className="flex-1 p-3"
                disabled={noneSelected}
              >
                <Text
                  className={`text-center text-sm ${
                    noneSelected ? "text-gray-400" : "text-red-600 font-medium"
                  }`}
                >
                  Clear All
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView className="max-h-64">
              {options.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const canSelect =
                  !maxSelections ||
                  selectedValues.length < maxSelections ||
                  isSelected;

                return (
                  <TouchableOpacity
                    key={option.value}
                    onPress={() => toggleOption(option.value)}
                    className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
                      isSelected ? "bg-blue-50" : canSelect ? "" : "opacity-50"
                    }`}
                    disabled={!canSelect}
                  >
                    <Text
                      className={`flex-1 ${
                        isSelected
                          ? "text-blue-600 font-medium"
                          : "text-gray-700"
                      }`}
                    >
                      {option.label}
                    </Text>
                    <View
                      className={`w-6 h-6 border-2 rounded-md items-center justify-center ${
                        isSelected
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && (
                        <Ionicons name="checkmark" size={16} color="white" />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              className="p-4 border-t border-gray-200"
            >
              <Text className="text-center text-blue-600 font-medium">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
