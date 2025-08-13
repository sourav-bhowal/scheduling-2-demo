import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface CustomDropdownProps {
  options: DropdownOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
}

export default function CustomDropdown({
  options,
  value,
  onValueChange,
  placeholder = 'Select option',
  label,
  required = false,
  disabled = false,
}: CustomDropdownProps) {
  const [isVisible, setIsVisible] = useState(false);

  const selectedOption = options.find(option => option.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  const handleSelect = (selectedValue: string) => {
    onValueChange(selectedValue);
    setIsVisible(false);
  };

  const openDropdown = () => {
    if (!disabled) {
      setIsVisible(true);
    }
  };

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
          disabled ? 'opacity-50' : ''
        }`}
        disabled={disabled}
      >
        <Text className={`flex-1 ${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {displayText}
        </Text>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color="#6B7280" 
        />
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
          <View className="bg-white rounded-lg m-4 max-h-80 w-80">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-lg font-semibold text-gray-800">
                {label || 'Select Option'}
              </Text>
            </View>
            
            <ScrollView className="max-h-60">
              {/* Clear/All option */}
              <TouchableOpacity
                onPress={() => handleSelect('')}
                className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
                  value === '' ? 'bg-blue-50' : ''
                }`}
              >
                <Text className={`${value === '' ? 'text-blue-600 font-medium' : 'text-gray-700'}`}>
                  All {label?.toLowerCase() || 'options'}
                </Text>
                {value === '' && (
                  <Ionicons name="checkmark" size={20} color="#2563EB" />
                )}
              </TouchableOpacity>

              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(option.value)}
                  className={`p-4 border-b border-gray-100 flex-row justify-between items-center ${
                    value === option.value ? 'bg-blue-50' : ''
                  }`}
                >
                  <Text className={`${
                    value === option.value ? 'text-blue-600 font-medium' : 'text-gray-700'
                  }`}>
                    {option.label}
                  </Text>
                  {value === option.value && (
                    <Ionicons name="checkmark" size={20} color="#2563EB" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              className="p-4 border-t border-gray-200"
            >
              <Text className="text-center text-blue-600 font-medium">Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
