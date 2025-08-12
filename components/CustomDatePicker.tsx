import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

interface CustomDatePickerProps {
  value: string; // ISO date string (YYYY-MM-DD)
  onDateChange: (date: string) => void;
  placeholder?: string;
  label?: string;
  mode?: 'date' | 'time' | 'datetime';
  minimumDate?: Date;
  maximumDate?: Date;
  required?: boolean;
}

export default function CustomDatePicker({
  value,
  onDateChange,
  placeholder = 'Select date',
  label,
  mode = 'date',
  minimumDate,
  maximumDate,
  required = false,
}: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert string value to Date object
  const dateValue = value ? new Date(value) : new Date();
  
  const formatDate = (date: Date) => {
    if (mode === 'date') {
      return date.toISOString().split('T')[0]; // YYYY-MM-DD
    } else if (mode === 'time') {
      return date.toTimeString().slice(0, 5); // HH:MM
    } else {
      return date.toISOString();
    }
  };
  
  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return placeholder;
    
    if (mode === 'date') {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } else if (mode === 'time') {
      return dateString; // Already in HH:MM format
    } else {
      const date = new Date(dateString);
      return date.toLocaleString();
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
        onPress={() => setIsOpen(true)}
        className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
      >
        <Text className={`${value ? 'text-gray-900' : 'text-gray-500'}`}>
          {formatDisplayDate(value)}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={isOpen}
        date={dateValue}
        mode={mode}
        minimumDate={minimumDate}
        maximumDate={maximumDate}
        onConfirm={(selectedDate) => {
          setIsOpen(false);
          const formattedDate = formatDate(selectedDate);
          onDateChange(formattedDate);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </View>
  );
}
