import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { images } from '@/constants';
import { useThemeColor } from '@/hooks/useThemeColor';

interface FileUploadFieldProps {
    frontImage: string | null;
    backImage: string | null;
    setFrontImage: (uri: string | null) => void;
    setBackImage: (uri: string | null) => void;
}

const FileUploadField: React.FC<FileUploadFieldProps> = ({ frontImage, backImage, setFrontImage, setBackImage }) => {
    // Theme colors for light & dark mode
    const backgroundColor = useThemeColor({ light: '#F8FCFF', dark: '#1E1E1E' }, 'background');
    const textColor = useThemeColor({ light: '#222222', dark: '#FFFFFF' }, 'text');
    const borderColor = useThemeColor({ light: '#ccc', dark: '#555555' }, 'border');

    // Function to pick an image
    const pickImage = async (setImage: (uri: string | null) => void) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            console.log("✅ Image Selected:", result.assets[0].uri);
        }
    };


    return (
        <View style={styles.container}>
            {/* Front Image Upload Box */}
            <TouchableOpacity
                style={[styles.uploadBox, { backgroundColor, borderColor }]}
                onPress={() => pickImage(setFrontImage)}
            >
                {frontImage ? (
                    <Image source={{ uri: frontImage }} style={styles.uploadedImage} />
                ) : (
                    <>
                        <Image style={styles.icon} source={images.front} />
                        <Text style={[styles.label, { color: textColor }]}>Front Image</Text>
                    </>
                )}
            </TouchableOpacity>

            {/* Back Image Upload Box */}
            <TouchableOpacity
                style={[styles.uploadBox, { backgroundColor, borderColor }]}
                onPress={() => pickImage(setBackImage)}
            >
                {backImage ? (
                    <Image source={{ uri: backImage }} style={styles.uploadedImage} />
                ) : (
                    <>
                        <Image style={styles.icon} source={images.front} />
                        <Text style={[styles.label, { color: textColor }]}>Back Image</Text>
                    </>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    uploadBox: {
        width: '48%',
        height: 120,
        borderWidth: 1,
        borderRadius: 10,
        borderStyle: 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
    },
    icon: {
        width: 20,
        height: 20,
        marginBottom: 5,
        resizeMode: 'contain',
    },
    label: {
        fontSize: 14,
    },
    uploadedImage: {
        width: '100%',
        height: '100%',
        borderRadius: 10,
        resizeMode: 'cover',
    },
});

export default FileUploadField;
