import React from 'react';
import { TextInput, TextInputProps, View } from 'react-native';

interface InputProps extends TextInputProps {
  placeholder?: string;
  value?: string;
}

const Input: React.FC<InputProps> = ({ placeholder, value, ...props }) => {
  return (
    <View>
      <TextInput
        placeholder={placeholder}
        value={value}
        {...props}
      />
    </View>
  );
};

export default Input;