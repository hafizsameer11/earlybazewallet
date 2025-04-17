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
import { validationForgetPasswordSchema } from "@/utils/validation";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Input from "@/utils/CustomInput";
import Button from "@/utils/Button";
import { useRouter, router } from "expo-router";
import useLoadFonts from "@/hooks/useLoadFonts";


//Code of the Integration 
import { forgotPassword, verifyPasswordOTP } from '@/utils/mutations/authMutations'
import { useMutation } from '@tanstack/react-query';
import Toast from "react-native-toast-message"; // ✅ Import Toast



const ForgetPassword = () => {
  const { dark } = useTheme();
  const [timer, setTimer] = useState(60);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const { back, push } = useRouter();
  const fontsLoaded = useLoadFonts(); // Load custom fonts

  useEffect(() => {
    let intervel: any;
    if (isTimerActive && timer > 0) {
      intervel = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerActive(false);
    }
    return () => clearTimeout(intervel);
  }, [timer, isTimerActive]);

  // ✅ Forgot Password Mutation
  const { mutate: forgotPass, isPending: isForgettingPass } = useMutation({
    mutationFn: async (data: { email: string }) => await forgotPassword(data),
    onSuccess: (data) => {
      console.log("✅ Forgot Password:", data);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "OTP sent to your email.",
      });
      setTimer(60);
      setIsTimerActive(true);
    },
    onError: (error) => {
      console.log("❌ Forgot Password Error:", error);
      // ✅ Show Error Toast
      Toast.show({
        type: "error",
        text1: "Error ❌",
        text2: error.message || "Something went wrong.",
        visibilityTime: 3000,
      });
    },
  });

  // ✅ Verify Password OTP Mutation
  const { mutate: verifyPassOtp, isPending: isVerifyingPassOtp } = useMutation({
    mutationFn: async (data: { otp: string; email: string }) => await verifyPasswordOTP(data),
    onSuccess: (data, variables) => {
      console.log("✅ Verify Password OTP:", data);
      console.log("The Email we are passing", variables.email);

      // ✅ Show Success Toast
      Toast.show({
        type: "success",
        text1: "OTP Verified ✅",
        text2: "Proceeding to reset password...",
        visibilityTime: 3000,
      });

      setTimeout(() => {
        push({ pathname: "/resetpassword", params: { email: variables.email } });
      }, 1000); // ✅ Navigate after showing toast
    },
    onError: (error) => {
      console.log("❌ Verify Password OTP Error:", error);

      // ✅ Show Error Toast
      Toast.show({
        type: "error",
        text1: "OTP Verification Failed ❌",
        text2: error.message || "Invalid OTP, please try again.",
        visibilityTime: 3000,
      });
    },
  });

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
              <Text style={[styles.loginText, { fontFamily: fontsLoaded ? 'Caprasimo' : undefined }]}>Forget Password</Text>
            </View>

            <Text
              style={[
                styles.bottomBoxText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              <View>
                <Formik
                  initialValues={{ email: "", inputPin: "" }}
                  onSubmit={() => { push(`/resetpassword?timer=${timer}`) }}
                  validationSchema={validationForgetPasswordSchema}
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
                          Email
                        </Text>
                        <Input
                          value={values.email}
                          onChangeText={handleChange("email")}
                          onBlur={handleBlur("email")}
                          label="Input email address"
                          sendCode
                          onSendCodePress={() => {
                            if (!values.email) {
                              alert("Please enter your email first.");
                              return;
                            }
                            forgotPass({ email: values.email }); // ✅ Trigger Forgot Password API
                            setTimer(60);
                            setIsTimerActive(true);
                          }}
                          keyboardType="email-address"
                          errorText={
                            touched.email && errors.email ? errors.email : ""
                          }
                          showCheckbox={false}
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
                          Input Code
                        </Text>
                        <Input
                          value={values.inputPin}
                          onChangeText={handleChange("inputPin")}
                          onBlur={handleBlur("inputPin")}
                          label="Input pin"
                          errorText={
                            touched.inputPin && errors.inputPin
                              ? errors.inputPin
                              : ""
                          }
                          showCheckbox={false}
                          prefilledValue={values.inputPin}
                          id="inputPin"
                        />
                      </View>
                      <Text style={{ marginBottom: 10 }}>
                        {isTimerActive && timer > 0 && (
                          <Text style={{ fontWeight: "bold", textAlign: 'center', color: dark ? COLORS.white : COLORS.black }}>OTP can be resent in
                            <Text style={{ color: COLORS.primary }}>{` 00 : ${timer} Sec`}</Text>
                          </Text>
                        )}
                      </Text>
                      <View style={{ marginBottom: 40 }}>
                        <Button
                          title="Proceed"
                          onPress={() => {
                            if (!values.email || !values.inputPin) {
                              Toast.show({
                                type: "error",
                                text1: "Missing Fields ❌",
                                text2: "Please enter both email and OTP.",
                                visibilityTime: 3000,
                              });
                              return;
                            }

                            verifyPassOtp({ otp: values.inputPin, email: values.email });
                          }}
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
    backgroundColor: 'white'
  },
  middleImg: {
    width: "100%",
    height: "100%",
    // borderRadius: Dimensions.get("window").width * 0.18, // Match the container's borderRadius
    resizeMode: "contain", // or use 'cover' if you want it to fill the circle and crop
    transform: [{ scale: 0.7 }]
  },
  bottomBox: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "center",
    paddingVertical: 20,
    zIndex: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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

export default ForgetPassword;
