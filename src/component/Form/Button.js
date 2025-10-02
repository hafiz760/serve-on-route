import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { COLOR } from '../../theme/typography';

export const Button = ({ 
  variant = 'default', 
  disabled, 
  style, 
  children, 
  ...props 
}) => {
  const btnStyle = [styles.button[variant]];
  if (disabled) {
    btnStyle.push(styles.disabled);
  }
  if (style) {
    btnStyle.push(style);
  }
  return (
    <Pressable
      {...props}
      style={({ pressed }) => [
        ...btnStyle,
        pressed && styles.pressed
      ]}
    >
      {React.Children.map(children, child => {
        if (typeof child === 'string') {
          // Wrap string children in Text
          return <Text style={styles.text}>{child}</Text>;
        }
        return child; // Pass through other children as-is
      })}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    default: {},
    primary: {
      backgroundColor: COLOR.primary,
      borderRadius: 10,
      justifyContent: 'center',
      paddingHorizontal: 15,
      paddingVertical: 15,
      marginHorizontal: 20,
    },
    secondary: {},
    transparent: {},
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    color: '#fff', // Default color for button text
    textAlign: 'center',
  },
});

export default Button;
