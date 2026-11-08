import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ANIMATIONS } from '@/assets/animations';
import { Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { Day1Button } from '../atoms/Day1Button';
import { Day1Lottie } from '../atoms/Day1Lottie';
import { Day1Text } from '../atoms/Day1Text';

type Day1ConfirmDeleteModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Day1ConfirmDeleteModal({
  visible,
  title,
  message,
  confirmLabel = 'Eliminar',
  loading = false,
  onConfirm,
  onCancel,
}: Day1ConfirmDeleteModalProps) {
  const colors = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        style={[styles.backdrop, { backgroundColor: colors.surfaceScrim }]}
        onPress={loading ? undefined : onCancel}
        accessibilityLabel="Cerrar">
        <Pressable
          style={[styles.card, { backgroundColor: colors.surfaceCard, borderColor: colors.borderSubtle }]}
          onPress={() => {}}>
          <Day1Lottie source={ANIMATIONS.delete} size={64} />
          <Day1Text variant="section20" style={styles.center}>
            {title}
          </Day1Text>
          <Day1Text variant="bodyRegular16" color={colors.textSecondaryReadable} style={styles.center}>
            {message}
          </Day1Text>
          <View style={styles.actions}>
            <Day1Button
              label="Cancelar"
              variant="secondary"
              onPress={onCancel}
              disabled={loading}
              style={styles.flex}
            />
            <Day1Button
              label={loading ? 'Eliminando...' : confirmLabel}
              variant="destructive"
              onPress={onConfirm}
              disabled={loading}
              style={styles.flex}
            />
          </View>
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
    borderRadius: Radius[20],
    borderWidth: 1,
    padding: Spacing[24],
    alignItems: 'center',
    gap: Spacing[12],
  },
  center: { textAlign: 'center' },
  actions: { flexDirection: 'row', gap: Spacing[12], width: '100%', marginTop: Spacing[8] },
  flex: { flex: 1 },
});
