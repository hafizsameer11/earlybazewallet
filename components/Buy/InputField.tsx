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
  const borderColor = useThemeColor({ light: '#FFFFF', dark: '#FFFFFF' }, 'border');

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
      <View style={[styles.container, { backgroundColor: bgColor, }]}>
        {label ? <Text style={[styles.label, { color: textColor }]}>{label}</Text> : null}
        <TextInput
          ref={inputRef}
          style={[styles.input, { color: textColor }]}
          value={label === 'Amount in USD' ? `$${value}` : value}
          editable={editable}
          onChangeText={onChange}
          keyboardType="numeric"
          {...props}
        />

      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    borderWidth: 1,
    borderRadius: 12,
    width: 155,
    height: 50,                    // ⬅️ Adjusted height to match sketch
    justifyContent: 'center',     // ⬅️ Vertically center content
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderColor: "#ebedec"
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    opacity: 0.6,
    marginTop: 12,
  },
  input: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 1,
  },
});


export default InputField;
