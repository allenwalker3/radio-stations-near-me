import { ReactNode } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import { GlobalStyles } from '../constants/styles';

type PrimaryButtonProps = {
  children: ReactNode,  
  onPress: () => void, 
  backgroundColor?: string | null, 
  color?: string | null
}
const PrimaryButton = ({ children, onPress, backgroundColor, color } : PrimaryButtonProps) => (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : [styles.buttonInnerContainer, { backgroundColor: backgroundColor ?? GlobalStyles.colors.primary700 }]
        }
        onPress={onPress}
        android_ripple={{ color: '#640233' }}
      >
        <Text style={[styles.buttonText, { color: color ?? 'white'} ]}>{children}</Text>
      </Pressable>
    </View>
)

export default PrimaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 28,
    margin: 4,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
 //   backgroundColor: backgroundColor ?? GlobalStyles.colors.primary700,
    paddingVertical: 8,
    paddingHorizontal: 16,
    elevation: 2,
  },
  buttonText: {
 //   color: color ?? 'white',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
