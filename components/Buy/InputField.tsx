import React, { useRef } from 'react';
import { View, Text, TextInput, StyleSheet, TextInputProps, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface InputFieldProps extends TextInputProps {
  label?: string;
  value?: string;
  editable?: boolean;
  onChange?: (text: string) => void;
  onPressDisabled?: () => void;  // Callback for when input is disabled
}

const InputField: React.FC<InputFieldProps> = ({ 
  label = '', 
  value = '', 
  editable = true, 
  onChange, 
  onPressDisabled, 
  ...props 
}) => {
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const bgColor = useThemeColor({ light: '#FFFFFF', dark: '#2D2D2D' }, 'inputBackground');
  const borderColor = useThemeColor({ light: '#C2C2C2', dark: '#3A3A3A' }, 'border');

  const inputRef = useRef<TextInput>(null);

  return (
    <TouchableWithoutFeedback 
      onPress={() => {
        console.log("the Input field Tap");
        if (editable) {
          inputRef.current?.focus();
        } else {
          onPressDisabled?.(); // Trigger toast if input is not editable
        }
      }} 
      accessible={false}
    >
      <View style={[styles.container, { backgroundColor: bgColor, borderColor }]}>
        {label ? <Text style={[styles.label, { color: textColor }]}>{label}</Text> : null}
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: textColor }]}
          value={value}
          editable={editable}
          onChangeText={onChange}
          keyboardType="numeric" // Ensure numeric keyboard
          {...props}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 0.31,
    borderRadius: 15,
    borderTopLeftRadius: 20,
    borderColor: '#E0E0E0',
    width: 147,
    height: 70,
    justifyContent: 'center',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    opacity: 0.6,
    marginBottom: 2,
  },
  input: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default InputField;
