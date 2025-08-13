import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface QuickDateSelectorProps {
  onDateSelect: (date: string) => void;
  label?: string;
  mode?: 'date' | 'time';
}

export default function QuickDateSelector({
  onDateSelect,
  label = "Quick Select",
  mode = 'date',
}: QuickDateSelectorProps) {
  
  const getQuickDateOptions = () => {
    if (mode === 'time') {
      return [
        { label: 'Now', value: new Date().toTimeString().slice(0, 5) },
        { label: '9:00 AM', value: '09:00' },
        { label: '12:00 PM', value: '12:00' },
        { label: '3:00 PM', value: '15:00' },
        { label: '6:00 PM', value: '18:00' },
      ];
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    const nextMonth = new Date(today);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    
    return [
      { label: 'Today', value: today.toISOString().split('T')[0] },
      { label: 'Tomorrow', value: tomorrow.toISOString().split('T')[0] },
      { label: 'Next Week', value: nextWeek.toISOString().split('T')[0] },
      { label: 'Next Month', value: nextMonth.toISOString().split('T')[0] },
    ];
  };

  const options = getQuickDateOptions();

  return (
    <View className="mt-2">
      <Text className="text-xs font-medium text-gray-600 mb-2">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onDateSelect(option.value)}
            className="bg-blue-50 border border-blue-200 rounded-full px-3 py-1"
          >
            <Text className="text-blue-700 text-xs font-medium">
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
