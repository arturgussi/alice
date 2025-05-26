import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import LinearGradientWrapper from '@components/wrappers/LinearGradientWrapper';
import { ThemedColors } from '@constants/Theme.style';

type AccordionItemProps = {
  isExpanded: SharedValue<boolean>;
  children: React.ReactNode;
  viewKey: string;
  style?: object;
  duration?: number;
};

function AccordionItem({
  isExpanded,
  children,
  viewKey,
  style,
  duration = 500,
}: AccordionItemProps) {
  const height = useSharedValue(0);

  const derivedHeight = useDerivedValue(() =>
    withTiming(height.value * Number(isExpanded.value), {
      duration,
    }),
  );
  const bodyStyle = useAnimatedStyle(() => ({
    height: derivedHeight.value,
  }));

  return (
    <Animated.View
      key={`accordionItem_${viewKey}`}
      style={[styles.animatedView, bodyStyle, style]}
    >
      <View
        onLayout={e => {
          height.value = e.nativeEvent.layout.height;
        }}
        style={styles.wrapper}
      >
        {children}
      </View>
    </Animated.View>
  );
}

type ParentProps = {
  open: SharedValue<boolean>;
  children: React.ReactNode;
};

function Parent({ open, children }: ParentProps) {
  return (
    <View style={styles.parent}>
      <AccordionItem isExpanded={open} viewKey="Accordion" style={undefined}>
        {children}
      </AccordionItem>
    </View>
  );
}

type AccordionButtonProps = {
  title: string;
  children?: React.ReactNode;
};

const AccordionButton = ({ title, children }: AccordionButtonProps) => {
  const open = useSharedValue(false);

  const onPress = () => {
    open.value = !open.value;

    if (open.value) {
      rotation.value = withTiming(0, { duration: 300 });
    } else {
      rotation.value = withTiming(0.5, { duration: 300 });
    }
  };

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          rotate: `${interpolate(rotation.value, [0, 0.5], [0, 90], {
            extrapolateLeft: Extrapolation.CLAMP,
            extrapolateRight: Extrapolation.CLAMP,
          })}deg`,
        },
      ],
    };
  });

  return (
    // Outter Container
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <LinearGradientWrapper
          color1={ThemedColors.background_card3}
          color2={ThemedColors.background_card2}
          style={styles.button}
        >
          <Text style={styles.text}>{title}</Text>
          <Animated.View style={animatedStyle}>
            <FontAwesomeIcon
              name="chevron-right"
              size={20}
              color={ThemedColors.placeholder}
            />
          </Animated.View>
        </LinearGradientWrapper>
      </TouchableOpacity>

      {/* Inner Container */}
      <View style={styles.content}>
        <Parent open={open}>{children}</Parent>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    flex: 1,
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: ThemedColors.text,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  parent: {
    flex: 1,
    width: '100%',
  },
  wrapper: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
  },
  animatedView: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
});

export default AccordionButton;
