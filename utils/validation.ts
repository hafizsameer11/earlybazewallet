import * as yup from "yup";
export const validationSignInSchema = yup.object().shape({
  email: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
  password: yup.string().required("Password is required"),
});

export const validationForgetPasswordSchema = yup.object().shape({
  email: yup.string().required("Email is required"),
  inputPin: yup.string().required("Pin is required").max(6).min(6),
});

export const validationResetPasswordSchema = yup.object().shape({
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Confirm Password is required")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export const validationRegistrationSchema = yup.object().shape({
    name: yup.string().required("Username is required"),
    fullName: yup.string().required("Full Name is required"),
    email: yup.string().required("Email is required")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email address"
    ),
    phone: yup.string().required("Phone number is required"),
    password: yup.string().required("Password is required"),
})