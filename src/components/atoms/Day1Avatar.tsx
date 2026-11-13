import { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Day1Text } from '@/components/atoms/Day1Text';
import { useTheme } from '@/hooks/use-theme';

type Day1AvatarProps = {
  uri?: string | null;
  name?: string | null;
  email?: string | null;
  size?: number;
};

export function Day1Avatar({ uri, name, email, size = 56 }: Day1AvatarProps) {
  const colors = useTheme();
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    setLoadFailed(false);
  }, [uri]);

  const trimmedUri = uri?.trim() || null;
  const initials = (name?.trim() || email?.trim() || 'D')[0].toUpperCase();
  const radius = size / 2;

  if (trimmedUri && !loadFailed) {
    return (
      <Image
        source={{ uri: trimmedUri }}
        onError={() => setLoadFailed(true)}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: radius,
            backgroundColor: colors.surfaceBrandSoft,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: colors.surfaceBrandSoft,
        },
      ]}>
      <Day1Text
        variant={size >= 72 ? 'heading28' : 'section24'}
        color={colors.actionPressed}>
        {initials}
      </Day1Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: { resizeMode: 'cover' },
  fallback: { alignItems: 'center', justifyContent: 'center' },
});
