import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import CustomDatePicker from '../../components/CustomDatePicker';
import TimePicker from '../../components/TimePicker';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addTimeSlot, deleteTimeSlot, TimeSlot } from '../../store/slices/authSlice';

export default function ManageAvailability() {
  const { user, doctorSlots } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [newSlot, setNewSlot] = useState({
    date: '',
    startTime: '',
    endTime: '',
    duration: '30',
    isRecurring: false,
    recurringDays: [] as string[],
  });

  const [showAddForm, setShowAddForm] = useState(false);

  if (!user || user.role !== 'doctor') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Access denied. Doctor login required.</Text>
      </View>
    );
  }

  const handleAddSlot = () => {
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const slot: TimeSlot = {
      id: Date.now().toString(),
      doctorId: user.id,
      date: newSlot.date,
      startTime: newSlot.startTime,
      endTime: newSlot.endTime,
      isAvailable: true,
      duration: parseInt(newSlot.duration),
      isRecurring: newSlot.isRecurring,
      recurringDays: newSlot.recurringDays,
    };

    dispatch(addTimeSlot(slot));
    setNewSlot({
      date: '',
      startTime: '',
      endTime: '',
      duration: '30',
      isRecurring: false,
      recurringDays: [],
    });
    setShowAddForm(false);
    Alert.alert('Success', 'Time slot added successfully');
  };

  const handleDeleteSlot = (slotId: string) => {
    Alert.alert(
      'Delete Time Slot',
      'Are you sure you want to delete this time slot?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => dispatch(deleteTimeSlot(slotId)) },
      ]
    );
  };

  const toggleRecurringDay = (day: string) => {
    setNewSlot(prev => ({
      ...prev,
      recurringDays: prev.recurringDays.includes(day)
        ? prev.recurringDays.filter(d => d !== day)
        : [...prev.recurringDays, day]
    }));
  };

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-blue-500 pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold">Manage Availability</Text>
        <Text className="text-blue-100 mt-1">Set your available appointment slots</Text>
      </View>

      {/* Add New Slot Button */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => setShowAddForm(!showAddForm)}
          className="bg-blue-500 py-3 rounded-lg mb-4"
        >
          <Text className="text-white text-center font-semibold">
            {showAddForm ? 'Cancel' : 'Add New Time Slot'}
          </Text>
        </TouchableOpacity>

        {/* Add Slot Form */}
        {showAddForm && (
          <View className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
            <Text className="text-lg font-semibold text-gray-800 mb-4">Add Time Slot</Text>
            
            <View className="space-y-4">
              <View>
                <CustomDatePicker
                  value={newSlot.date}
                  onDateChange={(date) => setNewSlot(prev => ({...prev, date}))}
                  label="Date"
                  placeholder="Select date"
                  minimumDate={new Date()}
                  required
                />
              </View>

              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <TimePicker
                    value={newSlot.startTime}
                    onTimeChange={(time) => setNewSlot(prev => ({...prev, startTime: time}))}
                    label="Start Time"
                    placeholder="Select start time"
                    required
                  />
                </View>
                <View className="flex-1">
                  <TimePicker
                    value={newSlot.endTime}
                    onTimeChange={(time) => setNewSlot(prev => ({...prev, endTime: time}))}
                    label="End Time"
                    placeholder="Select end time"
                    required
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">Duration (minutes)</Text>
                <TextInput
                  value={newSlot.duration}
                  onChangeText={(text) => setNewSlot(prev => ({...prev, duration: text}))}
                  placeholder="30"
                  keyboardType="numeric"
                  className="bg-gray-50 border border-gray-300 rounded-lg px-4 py-3"
                />
              </View>

              {/* Recurring Option */}
              <View>
                <TouchableOpacity
                  onPress={() => setNewSlot(prev => ({...prev, isRecurring: !prev.isRecurring}))}
                  className="flex-row items-center mb-3"
                >
                  <View className={`w-6 h-6 rounded border-2 mr-3 ${
                    newSlot.isRecurring ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                  }`}>
                    {newSlot.isRecurring && (
                      <Text className="text-white text-center text-sm">✓</Text>
                    )}
                  </View>
                  <Text className="text-gray-700">Make this a recurring slot</Text>
                </TouchableOpacity>

                {newSlot.isRecurring && (
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-2">Recurring Days</Text>
                    <View className="flex-row flex-wrap gap-2">
                      {weekDays.map(day => (
                        <TouchableOpacity
                          key={day}
                          onPress={() => toggleRecurringDay(day.toLowerCase())}
                          className={`px-3 py-2 rounded-lg border ${
                            newSlot.recurringDays.includes(day.toLowerCase())
                              ? 'bg-blue-500 border-blue-500'
                              : 'bg-white border-gray-300'
                          }`}
                        >
                          <Text className={`text-xs ${
                            newSlot.recurringDays.includes(day.toLowerCase())
                              ? 'text-white'
                              : 'text-gray-700'
                          }`}>
                            {day.slice(0, 3)}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={handleAddSlot}
                className="bg-green-500 py-3 rounded-lg mt-4"
              >
                <Text className="text-white text-center font-semibold">Add Time Slot</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Current Time Slots */}
        <View>
          <Text className="text-xl font-bold text-gray-800 mb-4">Current Time Slots</Text>
          {(doctorSlots || []).length === 0 ? (
            <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
              <Text className="text-gray-500 text-center mb-2">No time slots available</Text>
              <Text className="text-gray-400 text-sm text-center">
                Add your first time slot to start accepting appointments
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {doctorSlots.map((slot) => (
                <View key={slot.id} className="bg-white p-4 rounded-lg border border-gray-200">
                  <View className="flex-row justify-between items-start mb-2">
                    <View>
                      <Text className="font-semibold text-gray-800">{slot.date}</Text>
                      <Text className="text-gray-600">{slot.startTime} - {slot.endTime}</Text>
                      <Text className="text-gray-500 text-sm">{slot.duration} minutes</Text>
                      {slot.isRecurring && (
                        <Text className="text-blue-600 text-sm">
                          Recurring: {slot.recurringDays?.join(', ')}
                        </Text>
                      )}
                    </View>
                    <View className="flex-row space-x-2">
                      <View className={`px-2 py-1 rounded-full ${
                        slot.isAvailable ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Text className={`text-xs ${
                          slot.isAvailable ? 'text-green-800' : 'text-gray-600'
                        }`}>
                          {slot.isAvailable ? 'Available' : 'Booked'}
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDeleteSlot(slot.id)}
                        className="px-2 py-1 rounded-full bg-red-100"
                      >
                        <Text className="text-red-600 text-xs">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
