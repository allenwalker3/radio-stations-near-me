import { View, Text, Pressable, StyleSheet } from 'react-native';
import { GlobalStyles } from '../constants/styles';
import { ReactNode } from 'react';

type SecondaryButtonProps = {
  children: ReactNode,
  onPress: () => void
}

function SecondaryButton({ children, onPress }: SecondaryButtonProps) {
  return (
    <View style={styles.buttonOuterContainer}>
      <Pressable
        style={({ pressed }) =>
          pressed
            ? [styles.buttonInnerContainer, styles.pressed]
            : styles.buttonInnerContainer
        }
        onPress={onPress}
        android_ripple={{ color: '#52a8ea' }}
      >
        <Text style={styles.buttonText}>{children}</Text>
      </Pressable>
    </View>
  );
}

export default SecondaryButton;

const styles = StyleSheet.create({
  buttonOuterContainer: {
    borderRadius: 4,
    margin: 4,
    overflow: 'hidden',
  },
  buttonInnerContainer: {
    backgroundColor: GlobalStyles.colors.primary700,
    paddingVertical: 6,
    paddingHorizontal: 12,
    elevation: 2,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.75,
  },
});
