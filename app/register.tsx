import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/themeContext";
import { COLORS, icons, images } from "@/constants";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { validationRegistrationSchema } from "@/utils/validation";
import { Formik } from "formik";
import React from "react";
import Input from "@/utils/CustomInput";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import Button from "@/utils/Button";
import { useRouter } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import { KeyboardAvoidingView, Platform } from "react-native"; // ✅ Import

//Related to the Integration of the Register Page
import { signUpUser } from '@/utils/mutations/authMutations'
import { useMutation } from '@tanstack/react-query';
import Toast from "react-native-toast-message"; // ✅ Import Toast


export interface InputValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  invite_code: string;
  profile_picture?: string; // ✅ Add optional picture field
}

const Register = () => {
  const { dark } = useTheme();
  const { push } = useRouter();
  const [selectedImage, setSelectedImage] = useState<{ uri: string; name: string; type: string } | null>(null);


  const { isPending: isPendingRegister, mutate: mutateRegister } = useMutation({
    mutationFn: async (data: InputValues) => {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("password", data.password);
      formData.append("invite_code", data.invite_code);

      if (data.profile_picture) {
        formData.append("profile_picture", {
          uri: data.profile_picture.uri,
          name: data.profile_picture.name,
          type: data.profile_picture.type,
        } as any);
        console.log("✅ FormData Image:", data.profile_picture); // ✅ Log FormData image
      }


      return signUpUser(formData);
    },
    onSuccess: (data, variables) => {
      console.log("✅ Register Successful:", data);
      // ✅ Show Success Toast
      Toast.show({
        type: "success",
        text1: "Success ✅",
        text2: "Register Successful!",
        visibilityTime: 3000,
      });
    push({ pathname: "/Otp", params: { email: variables.email } });
    },
    onError: (error) => {
      console.error("❌ Register Failed:", error);
      // ✅ Show Error Toast
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: error.message || "Register failed, please try again.",
        visibilityTime: 3000,
      });
    },
  });

  const pickImage = async () => {
    console.log("Close the keyboard");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert("Permission to access media library is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ Updated deprecated API
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      const image = result.assets[0]; // Get the selected image
      const fileExtension = image.uri.split('.').pop(); // Extract file extension

      const imageObject = {
        uri: image.uri,
        name: `profile.${fileExtension}`, // Provide a name
        type: `image/${fileExtension}`, // Set the MIME type
      };

      setSelectedImage(imageObject);
      console.log("✅ Selected Image Object:", imageObject); // ✅ Console log image object
    }
  };

  return (

    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView
      // keyboardShouldPersistTaps="handled" // ✅ Allows tapping on inputs even when keyboard is open
      // enableOnAndroid={true} // ✅ Works for Android
      // extraScrollHeight={10} // ✅ Moves content up to avoid overlap
      >
        <View>
          <View style={styles.imageContainer}>
            <Image
              source={images.authImg}
              style={styles.image}
              contentFit="cover"
            />

            <View style={styles.middleImageContainer}>
              <TouchableOpacity
                style={[
                  styles.cameraContainer,
                  selectedImage && { backgroundColor: "transparent", top: 30 },
                ]}
                onPress={pickImage}
              >
                <Image
                  source={selectedImage ? selectedImage : icons.camera}
                  style={[
                    styles.cameraIcon,
                    selectedImage && {
                      width: 100,
                      height: 100,
                      borderRadius: 50,
                      marginBottom: 10,
                    },
                  ]}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBox}>
              <View
                style={[{ backgroundColor: dark ? COLORS.black : COLORS.white }]}
              >
                <View style={styles.loginContainer}>
                  <Text style={styles.loginText}>Register</Text>
                </View>
                <ScrollView
                  contentContainerStyle={styles.scrollContainer}
                  showsVerticalScrollIndicator={false}
                >
                  <Formik
                    initialValues={{
                      name: "",
                      email: "",
                      phone: "",
                      password: "",
                      invite_code: "",
                    }}
                    onSubmit={(values) => {
                      mutateRegister({ ...values, profile_picture: selectedImage || "" }); // ✅ Pass picture if available
                    }}
                    validationSchema={validationRegistrationSchema}
                  >
                    {({
                      handleChange,
                      handleBlur,
                      touched,
                      handleSubmit,
                      values,
                      errors,
                    }) => (
                      <View style={styles.formContainer}>
                        <View>
                          <Text
                            style={[
                              styles.inputLabel,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            Username
                          </Text>
                          <Input
                            value={values.name}
                            onChangeText={handleChange("name")}
                            onBlur={handleBlur("name")}
                            label="Input Username"
                            keyboardType="default"
                            showCheckbox={false}
                            errorText={
                              touched.name && errors.name
                                ? errors.name
                                : ""
                            }
                            prefilledValue={values.name}
                            id="name"
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.inputLabel,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            Email
                          </Text>
                          <Input
                            value={values.email}
                            onChangeText={handleChange("email")}
                            onBlur={handleBlur("email")}
                            label="Input Email"
                            keyboardType="email-address"
                            showCheckbox={false}
                            errorText={
                              touched.email && errors.email ? errors.email : ""
                            }
                            prefilledValue={values.email}
                            id="email"
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.inputLabel,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            Phone Number
                          </Text>
                          <Input
                            value={values.phone}
                            onChangeText={handleChange("phone")}
                            onBlur={handleBlur("phone")}
                            keyboardType="phone-pad"
                            label="Input Phone Number"
                            showCheckbox={false}
                            errorText={
                              touched.phone && errors.phone
                                ? errors.phone
                                : ""
                            }
                            prefilledValue={values.phone}
                            id="phone"
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.inputLabel,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            Password
                          </Text>
                          <Input
                            value={values.password}
                            onChangeText={handleChange("password")}
                            onBlur={handleBlur("password")}
                            label="Input Password"
                            keyboardType="default"
                            showCheckbox={false}
                            errorText={
                              touched.password && errors.password
                                ? errors.password
                                : ""
                            }
                            prefilledValue={values.password}
                            id="password"
                          />
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.inputLabel,
                              { color: dark ? COLORS.white : COLORS.black },
                            ]}
                          >
                            Referral Code
                          </Text>
                          <Input
                            value={values.invite_code}
                            onChangeText={handleChange("invite_code")}
                            onBlur={handleBlur("invite_code")}
                            label="Input Referral Code"
                            keyboardType="default"
                            showCheckbox={false}
                            errorText={
                              touched.invite_code && errors.invite_code
                                ? errors.invite_code
                                : ""
                            }
                            prefilledValue={values.invite_code}
                            id="referralCode"
                          />
                        </View>
                        <View>
                          <Button
                            title={isPendingRegister ? "Registering..." : "Register"} // ✅ Show "Registering..." when pending
                            onPress={() => handleSubmit()}
                            disabled={isPendingRegister} // ✅ Disable button while registering
                          />
                        </View>

                        <View style={styles.bottomBoxText}>
                          <Text
                            style={{
                              textAlign: "center",
                              color: dark ? COLORS.white : COLORS.black,
                            }}
                          >
                            Already have an account ?
                            <TouchableOpacity onPress={() => push("/login")}>
                              <Text
                                style={{
                                  color: COLORS.primary,
                                  fontWeight: "bold",
                                  marginLeft: 5,
                                  marginBottom: -2.4,

                                }}
                              >
                                Sign In
                              </Text>
                            </TouchableOpacity>
                          </Text>
                        </View>
                      </View>
                    )}
                  </Formik>
                </ScrollView>
              </View>
            </View>
          </View>
          <Toast /> {/* ✅ Add Toast Component to Render */}

        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 20,
  },
  middleImageContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  cameraContainer: {
    zIndex: 10,
    backgroundColor: COLORS.white,
    padding: 30,
    borderRadius: 50,
    top: 60,
  },
  cameraIcon: {
    padding: 10,
    width: 30,
    resizeMode: "contain",
    height: 30,
  },
  imageContainer: {
    width: "100%",
    height: Dimensions.get("window").height,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomBox: {
    position: "absolute",
    width: "100%",
    bottom: 0,
    top: 200,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 10,
  },
  inputLabel: {
    fontSize: 16,
  },
  loginContainer: {
    position: "absolute",
    paddingVertical: 10,
    zIndex: 1,
    top: -30,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: "center",
    width: "100%",
  },
  loginText: {
    fontSize: 22,
    textAlign: "center",
    color: COLORS.white,
    fontFamily: 'Caprasimo',

  },
  bottomBoxText: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default Register;
