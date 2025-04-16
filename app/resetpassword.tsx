import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/themeContext";
import { COLORS, images } from "@/constants";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Image } from "expo-image";
import { validationResetPasswordSchema } from "@/utils/validation";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Input from "@/utils/CustomInput";
import Button from "@/utils/Button";
import { useRouter, router, useLocalSearchParams } from "expo-router";
import useLoadFonts from "@/hooks/useLoadFonts";

//Code for the Integration of the Reset Password Screen
import { resetPassword } from '@/utils/mutations/authMutations'
import { useMutation } from '@tanstack/react-query'
import Toast from "react-native-toast-message"; // ✅ Import Toast


const ResetPassword = () => {
  const { dark } = useTheme();
  const { email } = useLocalSearchParams();
  const { back, push } = useRouter();

  console.log("📩 Received email:", email); // Debugging


  // ✅ Reset Password Mutation
  const { mutate: resetPass, isPending: isResettingPass } = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await resetPassword(data),
    onSuccess: (data) => {
      console.log("✅ Reset Password:", data);

      // ✅ Show Success Toast
      Toast.show({
        type: "success",
        text1: "Password Reset ✅",
        text2: "You can now log in with your new password.",
        visibilityTime: 3000, // 3 seconds
      });

      setTimeout(() => {
        push("/login");
      }, 1000); // ✅ Navigate after showing toast
    },
    onError: (error) => {
      console.log("❌ Reset Password Error:", error);

      // ✅ Show Error Toast
      Toast.show({
        type: "error",
        text1: "Reset Failed ❌",
        text2: error.message || "Please try again.",
        visibilityTime: 3000,
      });
    },
  });


  const fontsLoaded = useLoadFonts(); // Load custom fonts
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.imageContainer}>
          <Image
            source={images.authImg}
            style={styles.image}
            contentFit="cover"
          />
          <TouchableOpacity
            style={styles.arrowLeftContainer}
            onPress={() => {
              back();
            }}
          >
            <Image source={images.arrowLeft} style={styles.arrowLeft} />
          </TouchableOpacity>

          <View style={styles.middleImageContainer}>
            <Image source={images.authMidCircle} style={styles.middleImg} />
          </View>

          <View
            style={[
              styles.bottomBox,
              { backgroundColor: dark ? COLORS.black : COLORS.white },
            ]}
          >
            <View style={styles.loginContainer}>
              <Text style={[styles.loginText,]}>Reset Password</Text>
            </View>

            <Text
              style={[
                styles.bottomBoxText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              <View>
                <Formik
                  initialValues={{ password: "", confirmPassword: "" }}
                  onSubmit={(values: any) => console.log(values)}
                  validationSchema={validationResetPasswordSchema}
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
                          New Password
                        </Text>
                        <Input
                          value={values.password}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          label="Input new password"
                          errorText={
                            touched.password && errors.password
                              ? errors.password
                              : ""
                          }
                          showCheckbox={false}
                          prefilledValue={values.password}
                          id="new password"
                        />
                      </View>
                      <View>
                        <Text
                          style={[
                            styles.inputLabel,
                            { color: dark ? COLORS.white : COLORS.black },
                          ]}
                        >
                          New Password Again
                        </Text>
                        <Input
                          value={values.confirmPassword}
                          onChangeText={handleChange("confirmPassword")}
                          onBlur={handleBlur("confirmPassword")}
                          label="Input new password again"
                          errorText={
                            touched.confirmPassword && errors.confirmPassword
                              ? errors.confirmPassword
                              : ""
                          }
                          showCheckbox={false}
                          prefilledValue={values.confirmPassword}
                          id="confirmPassword"
                        />
                      </View>

                      <View style={{ paddingVertical: 10, marginBottom: 10 }}>
                        <Button
                          title={isResettingPass ? "Processing..." : "Proceed"} // ✅ Update text based on mutation state
                          onPress={() => {
                            if (!values.password || !values.confirmPassword) {
                              Toast.show({
                                type: "error",
                                text1: "Missing Fields ❌",
                                text2: "Please fill in both password fields.",
                                visibilityTime: 3000,
                              });
                              return;
                            }
                            if (values.password !== values.confirmPassword) {
                              Toast.show({
                                type: "error",
                                text1: "Passwords Mismatch ❌",
                                text2: "Passwords do not match.",
                                visibilityTime: 3000,
                              });
                              return;
                            }
                            if (!email) {
                              Toast.show({
                                type: "error",
                                text1: "Error ❌",
                                text2: "No email found, please restart the process.",
                                visibilityTime: 3000,
                              });
                              return;
                            }

                            resetPass({ email, password: values.password }); // ✅ Trigger API call
                          }}
                          disabled={isResettingPass} // ✅ Disable button while request is pending
                        />


                      </View>
                    </View>
                  )}
                </Formik>
              </View>
            </Text>
          </View>
          <Toast /> {/* ✅ Add Toast Component to Render */}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  arrowLeftContainer: {
    position: "absolute",
    top: 30,
    left: 20,
    backgroundColor: COLORS.white,
    padding: 10,
    borderRadius: 50,
  },
  arrowLeft: {
    width: 12,
    height: 12,
    tintColor: COLORS.dark1,
    objectFit: "contain",
  },
  imageContainer: {
    width: "100%",
    height: Dimensions.get("window").height - 0,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  middleImageContainer: {
    position: "absolute",
    top: "35%",
    left: "50%",
    transform: [
      { translateX: -Dimensions.get("window").width * 0.18 },
      { translateY: -Dimensions.get("window").width * 0.3 },
    ],
    width: Dimensions.get("window").width * 0.36,
    height: Dimensions.get("window").width * 0.36,
    borderRadius: Dimensions.get("window").width * 0.18,
    borderWidth: 2,
    borderColor: COLORS.greyscale300,
    justifyContent: "center",
    alignItems: "center",
  },
  middleImg: {
    width: "80%",
    height: "80%",
  },
  bottomBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 20,
    zIndex: 10,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 20,
    paddingBottom: 20,
    height: "100%",
  },
  inputLabel: {
    fontSize: 16,
  },
  loginContainer: {
    position: "absolute",
    paddingVertical: 10,
    zIndex: 1,
    top: -40,
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

export default ResetPassword;
