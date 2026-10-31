import { StyleSheet, View } from 'react-native';

type Day1CategoryDotProps = {
  color: string;
};

export function Day1CategoryDot({ color }: Day1CategoryDotProps) {
  return <View style={[styles.dot, { backgroundColor: color }]} />;
}

const styles = StyleSheet.create({
  dot: { width: 10, height: 10, borderRadius: 5 },
});