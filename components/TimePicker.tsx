import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import DatePicker from 'react-native-date-picker';

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
  placeholder = 'Select time',
  label,
  required = false,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Convert time string to Date object (using today's date)
  const getTimeAsDate = (timeString: string) => {
    const today = new Date();
    if (timeString) {
      const [hours, minutes] = timeString.split(':').map(Number);
      today.setHours(hours, minutes, 0, 0);
    }
    return today;
  };
  
  const formatTime = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };
  
  const formatDisplayTime = (timeString: string) => {
    if (!timeString) return placeholder;
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes);
    
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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
          {formatDisplayTime(value)}
        </Text>
      </TouchableOpacity>

      <DatePicker
        modal
        open={isOpen}
        date={getTimeAsDate(value)}
        mode="time"
        onConfirm={(selectedDate) => {
          setIsOpen(false);
          const formattedTime = formatTime(selectedDate);
          onTimeChange(formattedTime);
        }}
        onCancel={() => {
          setIsOpen(false);
        }}
      />
    </View>
  );
}
