import { useEffect, useRef } from 'react';
import { Modal, Pressable, StyleSheet } from 'react-native';

import { ANIMATIONS } from '@/assets/animations';
import { Day1Button } from '@/components/atoms/Day1Button';
import { Day1Lottie } from '@/components/atoms/Day1Lottie';
import { Day1Text } from '@/components/atoms/Day1Text';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type Day1FeedbackModalProps = {
  visible: boolean;
  title: string;
  message?: string;
  tone?: 'success' | 'delete';
  autoCloseMs?: number;
  onClose: () => void;
};

export function Day1FeedbackModal({
  visible,
  title,
  message,
  tone = 'success',
  autoCloseMs = 1600,
  onClose,
}: Day1FeedbackModalProps) {
  const colors = useTheme();
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (!visible || autoCloseMs <= 0) return;

    const timer = setTimeout(() => {
      onCloseRef.current();
    }, autoCloseMs);

    return () => clearTimeout(timer);
  }, [visible, autoCloseMs]);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.surfaceScrim }]}
        onPress={onClose}
        accessibilityLabel="Cerrar confirmación">
        <Pressable
          style={[
            styles.card,
            { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle },
          ]}
          onPress={() => {}}>
          <Day1Lottie
            source={tone === 'delete' ? ANIMATIONS.delete : ANIMATIONS.success}
            size={72}
            loop={false}
          />
          <Day1Text variant="section20" style={styles.center}>
            {title}
          </Day1Text>
          {message ? (
            <Day1Text
              variant="bodyRegular16"
              color={colors.textSecondaryReadable}
              style={styles.center}>
              {message}
            </Day1Text>
          ) : null}
          <Day1Button
            label="Continuar"
            variant="secondary"
            onPress={onClose}
            style={styles.button}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing[24],
  },
  card: {
    width: '100%',
    maxWidth: 340,
    borderRadius: Radius[20],
    borderWidth: 1,
    padding: Spacing[24],
    alignItems: 'center',
    gap: Spacing[12],
  },
  center: {
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing[4],
    width: '100%',
  },
});
