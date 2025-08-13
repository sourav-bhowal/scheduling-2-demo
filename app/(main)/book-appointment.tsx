import { useMemo, useState } from "react";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import CustomDropdown from "../../components/CustomDropdown";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  addAppointment,
  Appointment,
} from "../../store/slices/appointmentsSlice";
import { TimeSlot, updateTimeSlot, User } from "../../store/slices/authSlice";

export default function BookAppointment() {
  const { user, registeredUsers, doctorSlots } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();

  const [selectedDoctor, setSelectedDoctor] = useState<User | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedPet, setSelectedPet] = useState<any>(null);

  // Filter states
  const [filters, setFilters] = useState({
    petSpecies: "",
    medicalSpecialty: "",
    language: "",
  });

  // Dropdown options
  const petSpeciesOptions = [
    { label: "Dogs", value: "dogs" },
    { label: "Cats", value: "cats" },
    { label: "Birds", value: "birds" },
    { label: "Rabbits", value: "rabbits" },
    { label: "Reptiles", value: "reptiles" },
    { label: "Exotic Pets", value: "exotic" },
  ];

  const medicalSpecialtyOptions = [
    { label: "General Practice", value: "general" },
    { label: "Surgery", value: "surgery" },
    { label: "Dermatology", value: "dermatology" },
    { label: "Cardiology", value: "cardiology" },
    { label: "Dentistry", value: "dentistry" },
    { label: "Emergency Care", value: "emergency" },
    { label: "Orthopedics", value: "orthopedics" },
    { label: "Oncology", value: "oncology" },
  ];

  const languageOptions = [
    { label: "English", value: "english" },
    { label: "Spanish", value: "spanish" },
    { label: "French", value: "french" },
    { label: "German", value: "german" },
    { label: "Mandarin", value: "mandarin" },
    { label: "Hindi", value: "hindi" },
    { label: "Arabic", value: "arabic" },
  ];

  // Get all veterinarians (users with doctor role)
  const doctors = useMemo(() => {
    let filteredDoctors =
      registeredUsers?.filter((u) => u.role === "doctor") || [];

    // Apply filters
    if (filters.petSpecies) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.petSpecialization?.includes(filters.petSpecies)
      );
    }

    if (filters.medicalSpecialty) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.medicalSpecialty?.includes(filters.medicalSpecialty)
      );
    }

    if (filters.language) {
      filteredDoctors = filteredDoctors.filter((doctor) =>
        doctor.languages?.includes(filters.language)
      );
    }

    return filteredDoctors;
  }, [registeredUsers, filters]);

  // In a real app, you would fetch available slots from an API
  // For now, we only use slots that doctors have actually created through the manage-availability screen

  // Get available slots for the selected doctor from the doctorSlots array
  const availableDoctorSlots = useMemo(
    () =>
      doctorSlots.filter(
        (slot) => slot.doctorId === selectedDoctor?.id && slot.isAvailable
      ),
    [doctorSlots, selectedDoctor?.id]
  );

  if (!user || user.role !== "patient") {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500">
          Access denied. Patient login required.
        </Text>
      </View>
    );
  }

  const handleDoctorSelect = (doctor: User) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!selectedDoctor || !selectedSlot || !selectedPet) {
      Alert.alert(
        "Error",
        "Please select a veterinarian, your pet, and a time slot"
      );
      return;
    }

    const appointment: Appointment = {
      id: Date.now().toString(),
      title: `Veterinary Consultation with Dr. ${selectedDoctor.name}`,
      description: `${selectedDoctor.medicalSpecialty?.[0] || "General"} consultation for ${selectedDoctor.petSpecialization?.[0] || "pets"}`,
      date: selectedSlot.date,
      time: selectedSlot.startTime,
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      clientName: user!.name,
      clientPhone: user!.phone,
      clientEmail: user!.email,
      status: "scheduled",
      serviceType:
        selectedDoctor.medicalSpecialty?.[0] || "General Consultation",
      petSpecies: selectedPet?.species || "",
      petName: selectedPet?.name || "",
      petAge: selectedPet?.age || 0,
      duration: selectedSlot.duration,
      price: selectedDoctor.consultationFee || 100,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(addAppointment(appointment));

    // Mark slot as unavailable by updating the doctor's slot
    const updatedSlot = { ...selectedSlot, isAvailable: false };
    dispatch(updateTimeSlot(updatedSlot));

    Alert.alert(
      "Appointment Booked!",
      `Your appointment with Dr. ${selectedDoctor.name} for ${selectedPet.name} has been scheduled for ${selectedSlot.date} at ${selectedSlot.startTime}`,
      [
        {
          text: "OK",
          onPress: () => {
            setSelectedDoctor(null);
            setSelectedSlot(null);
            setSelectedPet(null);
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Debug Info - Remove this after testing */}
      {/* <SlotsDebugInfo /> */}

      {/* Header */}
      <View className="bg-green-500 pt-12 pb-6 px-4">
        <Text className="text-white text-2xl font-bold">
          Book Veterinary Appointment
        </Text>
        <Text className="text-green-100 mt-1">
          Find the right vet for your pet
        </Text>
      </View>

      {/* Filters */}
      <View className="p-4 bg-white border-b border-gray-200">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Find Your Veterinarian
        </Text>

        <View className="space-y-3 mb-3">
          <View className="flex-row gap-3">
            <View className="flex-1">
              <CustomDropdown
                label="Pet Species"
                options={petSpeciesOptions}
                value={filters.petSpecies}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, petSpecies: value }))
                }
                placeholder="All Species"
              />
            </View>

            <View className="flex-1">
              <CustomDropdown
                label="Medical Specialty"
                options={medicalSpecialtyOptions}
                value={filters.medicalSpecialty}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, medicalSpecialty: value }))
                }
                placeholder="All Specialties"
              />
            </View>
          </View>

          <View className="flex-row gap-3">
            <View className="flex-1">
              <CustomDropdown
                label="Language"
                options={languageOptions}
                value={filters.language}
                onValueChange={(value) =>
                  setFilters((prev) => ({ ...prev, language: value }))
                }
                placeholder="Any Language"
              />
            </View>

            <View className="flex-1 justify-end">
              {(filters.petSpecies ||
                filters.medicalSpecialty ||
                filters.language) && (
                <TouchableOpacity
                  onPress={() =>
                    setFilters({
                      petSpecies: "",
                      medicalSpecialty: "",
                      language: "",
                    })
                  }
                  className="bg-gray-100 px-4 py-3 rounded-lg items-center justify-center"
                >
                  <Text className="text-sm text-gray-600 font-medium">
                    Clear All Filters
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Filter Results Summary */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-gray-600">
            {doctors.length} veterinarian{doctors.length !== 1 ? "s" : ""}{" "}
            available
          </Text>
          {(filters.petSpecies ||
            filters.medicalSpecialty ||
            filters.language) && (
            <View className="flex-row flex-wrap gap-1">
              {filters.petSpecies && (
                <View className="bg-blue-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-blue-800 capitalize">
                    {filters.petSpecies}
                  </Text>
                </View>
              )}
              {filters.medicalSpecialty && (
                <View className="bg-green-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-green-800 capitalize">
                    {filters.medicalSpecialty}
                  </Text>
                </View>
              )}
              {filters.language && (
                <View className="bg-purple-100 px-2 py-1 rounded-full">
                  <Text className="text-xs text-purple-800 capitalize">
                    {filters.language}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Step 1: Select Doctor */}
      <View className="p-4">
        <Text className="text-xl font-bold text-gray-800 mb-4">
          Step 1: Select Doctor
        </Text>
        {doctors.length === 0 ? (
          <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
            <Text className="text-gray-500">No doctors available</Text>
            <Text className="text-gray-400 text-sm mt-1">
              Please check back later or contact support
            </Text>
          </View>
        ) : (
          <View className="space-y-3">
            {doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                onPress={() => handleDoctorSelect(doctor)}
                className={`bg-white p-4 rounded-lg border-2 ${
                  selectedDoctor?.id === doctor.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200"
                }`}
              >
                <View className="flex-row items-start">
                  <View className="w-12 h-12 bg-blue-100 rounded-full items-center justify-center mr-4">
                    <Text className="text-xl">👩‍⚕️</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-lg">
                      Dr. {doctor.name}
                    </Text>
                    <Text className="text-gray-600">
                      {doctor.medicalSpecialty?.[0]
                        ? doctor.medicalSpecialty[0].charAt(0).toUpperCase() +
                          doctor.medicalSpecialty[0].slice(1)
                        : "General Practice"}
                    </Text>
                    <Text className="text-blue-600 text-sm">
                      Specializes in:{" "}
                      {doctor.petSpecialization?.join(", ") || "All pets"}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {doctor.clinicName || "Veterinary Clinic"}
                    </Text>
                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-gray-500 text-sm">
                        {doctor.experience || 5} years experience
                      </Text>
                      <Text className="text-green-600 font-semibold">
                        ${doctor.consultationFee || 100}
                      </Text>
                    </View>
                    {doctor.languages && (
                      <Text className="text-xs text-gray-500 mt-1">
                        Languages: {doctor.languages.join(", ")}
                      </Text>
                    )}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* Step 2: Select Your Pet */}
      {selectedDoctor && (
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Step 2: Select Your Pet
          </Text>
          {!user?.pets || user.pets.length === 0 ? (
            <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
              <Text className="text-gray-500">No pets registered</Text>
              <Text className="text-gray-400 text-sm mt-1">
                Please add your pet information in your profile
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {user.pets.map((pet) => (
                <TouchableOpacity
                  key={pet.id}
                  onPress={() => setSelectedPet(pet)}
                  className={`bg-white p-4 rounded-lg border-2 ${
                    selectedPet?.id === pet.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <View className="flex-row items-start">
                    <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-4">
                      <Text className="text-xl">
                        {pet.species === "dog"
                          ? "🐕"
                          : pet.species === "cat"
                            ? "🐱"
                            : pet.species === "bird"
                              ? "🐦"
                              : pet.species === "rabbit"
                                ? "🐰"
                                : pet.species === "reptile"
                                  ? "🦎"
                                  : "🐾"}
                      </Text>
                    </View>
                    <View className="flex-1">
                      <Text className="font-semibold text-gray-800 text-lg">
                        {pet.name}
                      </Text>
                      <Text className="text-gray-600 capitalize">
                        {pet.species} {pet.breed && `• ${pet.breed}`}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {pet.age} years old {pet.weight && `• ${pet.weight}kg`}
                      </Text>
                      {pet.medicalHistory && pet.medicalHistory.length > 0 && (
                        <Text className="text-orange-600 text-xs mt-1">
                          Has medical history
                        </Text>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Step 3: Select Time Slot */}
      {selectedDoctor && selectedPet && (
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Step 3: Select Time Slot
          </Text>
          {(availableDoctorSlots || []).length === 0 ? (
            <View className="bg-white p-6 rounded-lg border border-gray-200 items-center">
              <Text className="text-gray-500">
                No available slots for this doctor
              </Text>
              <Text className="text-gray-400 text-sm mt-1">
                The doctor hasn&apos;t set their availability yet
              </Text>
            </View>
          ) : (
            <View className="space-y-3">
              {availableDoctorSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.id}
                  onPress={() => handleSlotSelect(slot)}
                  className={`bg-white p-4 rounded-lg border-2 ${
                    selectedSlot?.id === slot.id
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200"
                  }`}
                >
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="font-semibold text-gray-800">
                        {slot.date}
                      </Text>
                      <Text className="text-gray-600">
                        {slot.startTime} - {slot.endTime}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {slot.duration} minutes
                      </Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-800 text-sm font-medium">
                        Available
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* Booking Summary & Confirm */}
      {selectedDoctor && selectedSlot && selectedPet && (
        <View className="p-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Booking Summary
          </Text>
          <View className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <View className="space-y-2">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Veterinarian:</Text>
                <Text className="font-semibold">Dr. {selectedDoctor.name}</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Specialty:</Text>
                <Text className="font-semibold">
                  {selectedDoctor.medicalSpecialty?.[0]
                    ? selectedDoctor.medicalSpecialty[0]
                        .charAt(0)
                        .toUpperCase() +
                      selectedDoctor.medicalSpecialty[0].slice(1)
                    : "General Practice"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Pet Types:</Text>
                <Text className="font-semibold">
                  {selectedDoctor.petSpecialization?.join(", ") || "All pets"}
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Your Pet:</Text>
                <Text className="font-semibold">
                  {selectedPet.name} ({selectedPet.species})
                </Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Pet Age:</Text>
                <Text className="font-semibold">
                  {selectedPet.age} years old
                </Text>
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
                <Text className="font-semibold">
                  {selectedSlot.duration} minutes
                </Text>
              </View>
              <View className="flex-row justify-between border-t border-gray-200 pt-2">
                <Text className="text-gray-600">Consultation Fee:</Text>
                <Text className="font-bold text-green-600">
                  ${selectedDoctor.consultationFee}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleBookAppointment}
            className="bg-green-500 py-4 rounded-lg"
          >
            <Text className="text-white text-center font-bold text-lg">
              Confirm Booking
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}
