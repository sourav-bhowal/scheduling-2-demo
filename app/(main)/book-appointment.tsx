import { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addAppointment, Appointment } from '../../store/slices/appointmentsSlice';
import { setAvailableSlots } from '../../store/slices/authSlice';

// Mock doctors data
const mockDoctors = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    clinicName: 'Heart Care Clinic',
    consultationFee: 150,
    experience: 10,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialization: 'Dermatologist',
    clinicName: 'Skin Health Center',
    consultationFee: 120,
    experience: 8,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialization: 'Pediatrician',
    clinicName: 'Children\'s Medical Center',
    consultationFee: 100,
    experience: 12,
  },
];

// Mock time slots
const mockTimeSlots = [
  { id: '1', doctorId: '1', date: '2025-08-15', startTime: '09:00', endTime: '09:30', duration: 30, isAvailable: true },
  { id: '2', doctorId: '1', date: '2025-08-15', startTime: '10:00', endTime: '10:30', duration: 30, isAvailable: true },
  { id: '3', doctorId: '2', date: '2025-08-16', startTime: '14:00', endTime: '14:30', duration: 30, isAvailable: true },
  { id: '4', doctorId: '3', date: '2025-08-17', startTime: '11:00', endTime: '11:30', duration: 30, isAvailable: true },
];

export default function BookAppointment() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  
  const [selectedDoctor, setSelectedDoctor] = useState<typeof mockDoctors[0] | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<typeof mockTimeSlots[0] | null>(null);
  const [availableSlots, setLocalAvailableSlots] = useState(mockTimeSlots);

  useEffect(() => {
    // Simulate loading available slots
    dispatch(setAvailableSlots(mockTimeSlots));
  }, [dispatch]);

  if (!user || user.role !== 'patient') {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">Access denied. Patient login required.</Text>
      </View>
    );
  }

  const handleDoctorSelect = (doctor: typeof mockDoctors[0]) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: typeof mockTimeSlots[0]) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedSlot) {
      Alert.alert('Error', 'Please select a doctor and time slot');
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: `Consultation with ${selectedDoctor.name}`,
      description: `${selectedDoctor.specialization} consultation`,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      clientName: user.name,
      clientPhone: user.phone,
      clientEmail: user.email,
      status: 'scheduled',
      serviceType: selectedDoctor.specialization,
      duration: selectedSlot.duration,
      price: selectedDoctor.consultationFee,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addAppointment(appointment));
    
    // Mark slot as unavailable
    setLocalAvailableSlots(prev => 
      prev.map(slot => 
        slot.id === selectedSlot.id 
          ? { ...slot, isAvailable: false }
          : slot
      )
    );

    Alert.alert(
      'Success!',
      `Your appointment with ${selectedDoctor.name} has been booked for ${selectedSlot.date} at ${selectedSlot.startTime}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedDoctor(null);
            setSelectedSlot(null);
          }
        }
      ]
    );
  };

  const doctorSlots = availableSlots.filter(
    slot => slot.doctorId === selectedDoctor?.id && slot.isAvailable
  );

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-500 pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold">Book Appointment</Text>
        <Text className="text-green-100 mt-1">Choose a doctor and available time slot</Text>
      </View>

      {/* Step 1: Select Doctor */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">Step 1: Select Doctor</Text>
        <View className="space-y-3">
          {mockDoctors.map((doctor) => (
            <TouchableOpacity
              key={doctor.id}
              onPress={() => handleDoctorSelect(doctor)}
              className={`bg-white p-4 rounded-lg border-2 ${
                selectedDoctor?.id === doctor.id 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200'
              }`}
            >
              <View className="flex-row items-start">
                <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                  <Text className="text-xl">👩‍⚕️</Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-lg">{doctor.name}</Text>
                  <Text className="text-gray-600">{doctor.specialization}</Text>
                  <Text className="text-gray-500 text-sm">{doctor.clinicName}</Text>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-gray-500 text-sm">{doctor.experience} years experience</Text>
                    <Text className="text-green-600 font-semibold">${doctor.consultationFee}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Step 2: Select Time Slot */}
      {selectedDoctor && (
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">Step 2: Select Time Slot</Text>
          {(doctorSlots || []).length === 0 ? (
            <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
              <Text className="text-gray-500">No available slots for this doctor</Text>
            </View>
          ) : (
            <View className="space-y-3">
              {doctorSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => handleSlotSelect(slot)}
                  className={`bg-white p-4 rounded-lg border-2 ${
                    selectedSlot?.id === slot.id 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-semibold text-gray-800">{slot.date}</Text>
                      <Text className="text-gray-600">{slot.startTime} - {slot.endTime}</Text>
                      <Text className="text-gray-500 text-sm">{slot.duration} minutes</Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-800 text-sm font-medium">Available</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Booking Summary & Confirm */}
      {selectedDoctor && selectedSlot && (
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">Booking Summary</Text>
          <View className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Doctor:</Text>
                <Text className="font-semibold">{selectedDoctor.name}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Specialization:</Text>
                <Text className="font-semibold">{selectedDoctor.specialization}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Date:</Text>
                <Text className="font-semibold">{selectedSlot.date}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Time:</Text>
                <Text className="font-semibold">{selectedSlot.startTime}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Duration:</Text>
                <Text className="font-semibold">{selectedSlot.duration} minutes</Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-200 pt-2">
                <Text className="text-gray-600">Consultation Fee:</Text>
                <Text className="font-bold text-green-600">${selectedDoctor.consultationFee}</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleBookAppointment}
            className="bg-green-500 py-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold text-lg">Confirm Booking</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
