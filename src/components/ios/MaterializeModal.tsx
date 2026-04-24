/**
 * 全屏 Modal + useMaterialize：卡片区 opacity/scale，背景 Blur + scrim 与 blurIntensity 联动。
 * 根 Modal 使用 `animationType="none"`，避免与 materialize 进出场重叠加。
 */
import { BlurView } from "expo-blur";
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
  View,
} from "react-native";
import Animated, { useAnimatedProps, useAnimatedStyle } from "react-native-reanimated";

import { useMaterialize } from "../../hooks/useMaterialize";
import { FADE_MS } from "../../theme/motion";
import { useAppTheme } from "../../theme/ThemeContext";

const AnimatedBlurView = Animated.createAnimatedComponent(BlurView);

export type MaterializeModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
  /** 卡片区外层（居中 padding 等） */
  contentStyle?: StyleProp<ViewStyle>;
};

const EXIT_MS = FADE_MS.fast + 80;

export function MaterializeModal({
  visible,
  onRequestClose,
  children,
  contentStyle,
}: MaterializeModalProps): React.ReactElement | null {
  const { colorScheme, colors } = useAppTheme();
  const { opacity, scale, blurIntensity, materialize, dematerialize } = useMaterialize();
  const [rendered, setRendered] = useState(visible);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback((): void => {
    if (closeTimerRef.current != null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (visible) {
      clearCloseTimer();
      setRendered(true);
      return;
    }
    if (!visible && rendered) {
      dematerialize();
      clearCloseTimer();
      closeTimerRef.current = setTimeout(() => {
        setRendered(false);
        closeTimerRef.current = null;
      }, EXIT_MS);
    }
    return () => {
      clearCloseTimer();
    };
  }, [visible, rendered, dematerialize, clearCloseTimer]);

  useLayoutEffect(() => {
    if (visible && rendered) {
      materialize();
    }
  }, [visible, rendered, materialize]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const scrimStyle = useAnimatedStyle(() => ({
    opacity: opacity.value * 0.55,
  }));

  const animatedBlurProps = useAnimatedProps(() => {
    const v = Math.round(
      Math.min(100, Math.max(0, blurIntensity.value)),
    );
    return { intensity: v } as { intensity: number };
  });

  const tint: "light" | "dark" = colorScheme === "dark" ? "dark" : "light";

  const handleRequestClose = useCallback((): void => {
    onRequestClose();
  }, [onRequestClose]);

  if (!rendered) {
    return null;
  }

  return (
    <Modal
      visible={rendered}
      transparent
      animationType="none"
      onRequestClose={handleRequestClose}
    >
      <View style={styles.root} accessibilityViewIsModal>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleRequestClose}
          accessibilityRole="button"
          accessibilityLabel="关闭"
        >
          <AnimatedBlurView
            style={StyleSheet.absoluteFill}
            tint={tint}
            animatedProps={animatedBlurProps}
          />
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.modalScrim },
              scrimStyle,
            ]}
          />
        </Pressable>
        <View
          style={[styles.content, contentStyle]}
          pointerEvents="box-none"
        >
          <Animated.View style={cardStyle}>{children}</Animated.View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    padding: 24,
  },
});
