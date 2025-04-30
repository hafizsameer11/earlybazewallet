import { useMutation } from '@tanstack/react-query';

// API call
const validateEmail = async ({ email, token }: { email: string; token: string }) => {
  const response = await fetch('https://earlybaze.hmstech.xyz/api/validate-email', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to validate email');
  }

  return response.json();
};

// Hook
const useValidateEmail = () => {
  return useMutation({
    mutationFn: ({ email, token }: { email: string; token: string }) => validateEmail({ email, token }),
  });
};

export default useValidateEmail;
