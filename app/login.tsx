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
import { validationSignInSchema } from "@/utils/validation";
import { Formik } from "formik";
import React from "react";
import Input from "@/utils/CustomInput";
import Button from "@/utils/Button";
import { router, useRouter } from "expo-router";
import useLoadFonts from "@/hooks/useLoadFonts";
import { loginUser } from "@/utils/mutations/authMutations";
import { useEffect } from "react";
import { saveToStorage } from "@/utils/storage";
import { BackHandler, Alert } from 'react-native';

//Related to the Integration of the Login Page
import { useMutation } from '@tanstack/react-query';
import Toast from "react-native-toast-message";

export interface InputValues {
  email: string;
  password: string;
}

const Login = () => {
  const { dark } = useTheme();
  const { push } = useRouter();
  const fontsLoaded = useLoadFonts();
  const { replace } = useRouter();

  useEffect(() => {
    const backAction = () => {
      Alert.alert("Hold on!", "Are you sure you want to exit?", [
        {
          text: "Cancel",
          onPress: () => null,
          style: "cancel"
        },
        { text: "Exit", onPress: () => BackHandler.exitApp() }
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // ✅ Mutation for Login
  const { isPending: isPendingLogin, mutate: mutateLogin } = useMutation({
    mutationFn: (data: InputValues) => loginUser(data),
    onSuccess: async (response) => {
      try {
        console.log("✅ Login Successful:", response);

        // Extract necessary data
        const { token, user, assets } = response.data;

        // ✅ Store token securely
        await saveToStorage("authToken", token);
        await saveToStorage("user", user);
        await saveToStorage("assets", assets);

        console.log("🔹 Token, User, and Assets saved successfully!");

        // ✅ Show success toast before navigating
        Toast.show({
          type: "success",
          text1: "Login Successful 🎉",
          text2: "Welcome back!",
          visibilityTime: 3000, // 3 seconds
        });

        setTimeout(() => {
          replace("/(tabs)"); // ✅ Navigate after delay
        }, 800); // 1 second delay

      } catch (error) {
        console.error("❌ Error saving data:", error);
      }
    },

    onError: (error) => {
      console.error("❌ Login Failed:", error);

      // ✅ Show error toast
      Toast.show({
        type: "error",
        text1: "Login Failed ❌",
        text2: error.message || "Please try again.",
        visibilityTime: 3000, // 3 seconds
      });
    }
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
              <Text style={[styles.loginText, { fontFamily: 'Caprasimo' }]}>Login</Text>
            </View>

            <Text
              style={[
                styles.bottomBoxText,
                { color: dark ? COLORS.white : COLORS.black },
              ]}
            >
              <View>
                <Formik
                  initialValues={{ email: "", password: "" }}
                  validationSchema={validationSignInSchema}
                  onSubmit={(values) => mutateLogin(values)}
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
                          keyboardType="email-address"
                          errorText={touched.email && errors.email ? errors.email : ""}
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
                          Password
                        </Text>
                        <Input
                          value={values.password}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          label="Input Password"
                          secureTextEntry
                          showCheckbox={false}
                          prefilledValue={values.password}
                          id="password"
                        />
                      </View>
                      <TouchableOpacity onPress={() => push("/forgetpassword")}>
                        <Text
                          style={{
                            color: COLORS.primary,
                            textAlign: "right",
                            position: "relative",
                            bottom: 12,
                          }}
                        >
                          Forgot Password ?
                        </Text>
                      </TouchableOpacity>
                      <View>
                        <Button
                          title={isPendingLogin ? "Logging in..." : "Login"}
                          onPress={handleSubmit}
                          disabled={isPendingLogin}
                        />
                      </View>
                      <View style={styles.bottomBoxText}>
                        <Text
                          style={{
                            textAlign: "center",
                            color: dark ? COLORS.white : COLORS.black,
                          }}
                        >
                          Don't have an account ?
                          <TouchableOpacity onPress={() => push("/register")}>
                            <Text
                              style={{
                                color: COLORS.primary,
                                fontWeight: "bold",
                                marginBottom: -2.2,
                              }}
                            >
                              {" "} Sign Up
                            </Text>
                          </TouchableOpacity>
                        </Text>
                      </View>
                    </View>
                  )}
                </Formik>

              </View>
            </Text>
          </View>
        </View>
        <Toast />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    flex: 1,
    height: "100%",
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
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
    width: "100%",
  },
  loginText: {
    fontSize: 22,
    textAlign: "center",
    color: COLORS.white,
  },
  bottomBoxText: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 10,
  },
});

export default Login;
