import { useRef, useState, type ComponentRef, type RefObject } from 'react';
import { TextInput, type TextInputProps, type ViewStyle } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { Spacing, Typography } from '@/constants/theme';
import { Day1InputShell } from '../atoms/Day1InputShell';
import { useKeyboardScroll } from '../atoms/Day1KeyboardScrollView';
import { Day1FormField } from './Day1FormField';

type TextInputInstance = ComponentRef<typeof TextInput>;

type Day1TextFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
  containerStyle?: ViewStyle;
  inputRef?: RefObject<TextInputInstance | null>;
};

export function Day1TextField({
  label,
  helperText,
  containerStyle,
  inputRef,
  style,
  onFocus,
  onBlur,
  ...rest
}: Day1TextFieldProps) {
  const colors = useTheme();
  const [focused, setFocused] = useState(false);
  const internalRef = useRef<TextInputInstance>(null);
  const resolvedRef = inputRef ?? internalRef;
  const keyboardScroll = useKeyboardScroll();

  return (
    <Day1FormField label={label} helperText={helperText} focused={focused} style={containerStyle}>
      <Day1InputShell focused={focused} style={{ paddingHorizontal: 0, paddingVertical: 0 }}>
        <TextInput
          ref={resolvedRef}
          placeholderTextColor={colors.textSecondaryReadable}
          selectionColor={colors.actionPrimary}
          cursorColor={colors.actionPrimary}
          accessibilityLabel={label}
          onFocus={(event) => {
            setFocused(true);
            keyboardScroll?.scrollToInput(
              resolvedRef.current as unknown as {
                measureInWindow: (
                  callback: (x: number, y: number, width: number, height: number) => void,
                ) => void;
              } | null,
            );
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={[
            Typography.bodyRegular16,
            {
              flex: 1,
              minHeight: 49,
              paddingHorizontal: 14,
              paddingVertical: Spacing[12],
              margin: 0,
              color: colors.textPrimary,
            },
            style,
          ]}
          {...rest}
        />
      </Day1InputShell>
    </Day1FormField>
  );
}
