import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import InputField from '@/components/Setting/Kyc/InputField';
import DatePickerField from '@/components/Setting/Kyc/DatePickerField';
import DropdownField from '@/components/Setting/Kyc/DropdownField';
import FileUploadField from '@/components/Setting/Kyc/FileUploadField';
import PrimaryButton from '@/components/Buy/PrimaryButton';
import { useThemeColor } from '@/hooks/useThemeColor';
import Header from '@/components/Header';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';


//Code related to the Integration
import { createKycRequest } from '@/utils/mutations/accountMutations';
import { useMutation } from '@tanstack/react-query';
import { getFromStorage } from "@/utils/storage";
import { router } from 'expo-router';
import Toast from 'react-native-toast-message';



const KycDetail: React.FC = () => {
    const [token, setToken] = useState<string | null>(null); // State to hold the token

    const [form, setForm] = useState({
        first_name: '',
        last_name: '',
        dob: '',
        address: '',
        state: '',
        bvn: '',
        document_type: '',
        document_number: '',
        profile_image: null, // New field for profile picture
        document_front: null,   // Front document image
        document_back: null,    // Back document image
    });

    const backgroundColor = useThemeColor({ light: '#EFFEF9', dark: '#000000' }, 'background');

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setForm({ ...form, profile_image: result.assets[0].uri });
        }
    };

    // Fetch the token and user data when the component mounts
    useEffect(() => {
        const fetchUserData = async () => {
            const fetchedToken = await getFromStorage("authToken");
            setToken(fetchedToken);
            console.log("🔹 Retrieved Token:", fetchedToken);
        };

        fetchUserData();
    }, []);

    // Mutation to create KYC request
    const { isPending: isPendingKyc, mutate: mutateKyc } = useMutation({
        mutationFn: ({ data, token }: { data: FormData; token: string }) => createKycRequest({ data, token }),
        onSuccess: (data) => {
            console.log("✅ KYC Request Created:", data);
            //move to home page
            Toast.show({
                type: 'success',
                text1: 'KYC Request Created',
                text2: 'Your KYC request has been submitted successfully.',
            });
            router.push("/(tabs)")
        },
        onError: (error) => {
            console.error("❌ KYC Request Failed:", error);

            Toast.show({
                type: 'error',
                text1: 'KYC Request Failed',
                text2: error?.response?.data?.message || error?.message || 'Something went wrong',
                position: 'top',
            });
        }

    });
    const handleKycSubmission = (form: any, token: string | null, mutateKyc: Function) => {
        if (!token) {
            console.error("❌ No token available");
            return;
        }

        const formData = new FormData();
        formData.append("first_name", form.first_name);
        formData.append("last_name", form.last_name);
        formData.append("dob", form.dob);
        formData.append("address", form.address);
        formData.append("state", form.state);
        formData.append("bvn", form.bvn);
        formData.append("document_type", form.document_type);
        formData.append("document_number", form.document_number);

        // Append images only if they exist
        if (form.profile_image) {
            formData.append("profile_image", {
                uri: form.profile_image,
                name: "profile.jpg",
                type: "image/jpeg",
            } as any);
        }

        if (form.document_front) {
            formData.append("document_front", {
                uri: form.document_front,
                name: "document_front.jpg",
                type: "image/jpeg",
            } as any);
        }

        if (form.document_back) {
            formData.append("document_back", {
                uri: form.document_back,
                name: "document_back.jpg",
                type: "image/jpeg",
            } as any);
        }

        console.log("📤 Submitting KYC Request:", formData);

        // Call mutation with FormData and token
        mutateKyc({ data: formData, token });
    };

    return (
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
            <Header title="KYC Details" />

            {/* Profile Picture Upload Button */}
            <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                {form.profile_image ? (
                    <Image source={{ uri: form.profile_image }} style={styles.profileImage} />
                ) : (
                    <Ionicons name="camera-outline" size={25} color="black" />
                )}
            </TouchableOpacity>

            <InputField label="First Name" placeholder="First name" value={form.first_name} onChangeText={(val) => setForm({ ...form, first_name: val })} />
            <InputField label="Last Name" placeholder="Last name" value={form.last_name} onChangeText={(val) => setForm({ ...form, last_name: val })} />
            <DatePickerField label="Date of Birth" value={form.dob} onChange={(date) => setForm({ ...form, dob: date })} />
            <InputField label="Address" placeholder="Residential address" value={form.address} onChangeText={(val) => setForm({ ...form, address: val })} />
            <InputField label="State" placeholder="State of residence" value={form.state} onChangeText={(val) => setForm({ ...form, state: val })} />
            <InputField label="BVN" placeholder="Bank Verification Number" value={form.bvn} onChangeText={(val) => setForm({ ...form, bvn: val })} />
            <DropdownField label="Type of Document" options={['National ID card', 'International Passport', 'Voters Card', 'Drivers License']}
                selectedValue={form.document_type} onSelect={(val) => setForm({ ...form, document_type: val })} />
            <InputField label="Document Number" placeholder="Document Number" value={form.document_number} onChangeText={(val) => setForm({ ...form, document_number: val })} />

            {/* File Upload Fields */}
            <FileUploadField
                frontImage={form.document_front}
                backImage={form.document_back}
                setFrontImage={(uri) => setForm({ ...form, document_front: uri })}
                setBackImage={(uri) => setForm({ ...form, document_back: uri })}
            />

            <PrimaryButton
                title={isPendingKyc ? "Submitting..." : "Proceed"}
                onPress={() => handleKycSubmission(form, token, mutateKyc)}
            />


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingBottom: 20,
        paddingTop: 20,
    },
    uploadButton: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#DFDFDF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        alignSelf: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
});

export default KycDetail;
