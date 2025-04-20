import { View, Text } from 'react-native';
import React from 'react';
import { Stack } from 'expo-router';
// import Toast from 'react-native-toast-message';
// import CustomToast from '@/components/CustomToast';
// import TokenExpiryModal from '../app/tokenexpirymodal';
// import { useAppSelector } from '@/store/slices/authSlice';

const ScreenStacks = () => {
  //   const { token } = useAppSelector((state) => state.auth);
  //   console.log('Stack: ', token);
  return (
    <>
      <Stack>
        <Stack.Screen name="Buy" options={{ headerShown: false }} />
        <Stack.Screen name="SendReceive" options={{ headerShown: false }} />
        <Stack.Screen name="MyAssest" options={{ headerShown: false }} />
        <Stack.Screen name="Swap" options={{ headerShown: false }} />
        <Stack.Screen name='PaymentSummary' options={{ headerShown: false }} />
        <Stack.Screen name="PaymentProof" options={{ headerShown: false }} />
        <Stack.Screen name="TransactionPage" options={{ headerShown: false }} />
        <Stack.Screen name="Withdraw" options={{ headerShown: false }} />
        <Stack.Screen name="SwapSummary" options={{ headerShown: false }} />
        <Stack.Screen name='TransactionSummary' options={{ headerShown: false }} />
        <Stack.Screen name="Receive" options={{ headerShown: false }} />
        <Stack.Screen name="SummaryReceive" options={{ headerShown: false }} />
        <Stack.Screen name="Send" options={{ headerShown: false }} />
        <Stack.Screen name="EditProfile" options={{ headerShown: false }} />
        <Stack.Screen name="Account" options={{ headerShown: false }} />
        <Stack.Screen name="AddAccount" options={{ headerShown: false }} />
        <Stack.Screen name="Referral" options={{ headerShown: false }} />
        <Stack.Screen name="Kyc" options={{ headerShown: false }} />
        <Stack.Screen name="KycDetail" options={{ headerShown: false }} />
        <Stack.Screen name="Notification" options={{ headerShown: false }} />
        <Stack.Screen name="Support" options={{ headerShown: false }} />
        <Stack.Screen name="Tickets" options={{ headerShown: false }} />
        <Stack.Screen name="TicketChat" options={{ headerShown: false }} />
        <Stack.Screen name='Security' options={{ headerShown: false }} />

        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="forgetpassword" options={{ headerShown: false }} />
        <Stack.Screen name="resetpassword" options={{ headerShown: false }} />
        <Stack.Screen name="Otp" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      {/* <Toast
        config={{
          success: (internalProps) => <CustomToast {...internalProps} />,
          error: (internalProps) => <CustomToast {...internalProps} />,
          info: (internalProps) => <CustomToast {...internalProps} />,
        }}
      /> */}
      {/* <TokenExpiryModal /> */}
    </>
  );
};

export default ScreenStacks;
