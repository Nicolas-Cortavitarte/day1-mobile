import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ComponentRef,
  type PropsWithChildren,
} from 'react';
import {
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  type ScrollViewProps,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

type KeyboardScrollTarget = {
  measureInWindow: (
    callback: (x: number, y: number, width: number, height: number) => void,
  ) => void;
};

type KeyboardScrollContextValue = {
  scrollToInput: (target: KeyboardScrollTarget | null) => void;
};

const KeyboardScrollContext = createContext<KeyboardScrollContextValue | null>(null);

export function useKeyboardScroll() {
  return use(KeyboardScrollContext);
}

type Day1KeyboardScrollViewProps = Omit<ScrollViewProps, 'contentContainerStyle'> &
  PropsWithChildren<{
    contentContainerStyle?: StyleProp<ViewStyle>;
  }>;

export function Day1KeyboardScrollView({
  children,
  contentContainerStyle,
  onScroll,
  ...rest
}: Day1KeyboardScrollViewProps) {
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const scrollOffsetRef = useRef(0);
  const keyboardHeightRef = useRef(0);
  const pendingTargetRef = useRef<KeyboardScrollTarget | null>(null);
  const [androidKeyboardPadding, setAndroidKeyboardPadding] = useState(0);

  const measureAndScroll = useCallback((target: KeyboardScrollTarget | null) => {
    if (!target || typeof target.measureInWindow !== 'function') return;
    const kbHeight = keyboardHeightRef.current;
    if (kbHeight <= 0) return;

    target.measureInWindow((_x, y, _width, height) => {
      const windowHeight = Dimensions.get('window').height;
      const visibleBottom = windowHeight - kbHeight - 28;
      const inputBottom = y + height;

      if (inputBottom > visibleBottom) {
        const delta = inputBottom - visibleBottom;
        scrollRef.current?.scrollTo({
          y: Math.max(0, scrollOffsetRef.current + delta),
          animated: true,
        });
      } else if (y < 72) {
        const delta = 72 - y;
        scrollRef.current?.scrollTo({
          y: Math.max(0, scrollOffsetRef.current - delta),
          animated: true,
        });
      }
    });
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (event) => {
      const height = event.endCoordinates.height;
      keyboardHeightRef.current = height;
      if (Platform.OS === 'android') {
        setAndroidKeyboardPadding(height);
      }
      if (pendingTargetRef.current) {
        setTimeout(() => {
          measureAndScroll(pendingTargetRef.current);
        }, 60);
      }
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardHeightRef.current = 0;
      pendingTargetRef.current = null;
      if (Platform.OS === 'android') {
        setAndroidKeyboardPadding(0);
      }
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [measureAndScroll]);

  const scrollToInput = useCallback(
    (target: KeyboardScrollTarget | null) => {
      pendingTargetRef.current = target;
      if (keyboardHeightRef.current > 0) {
        setTimeout(() => {
          measureAndScroll(target);
        }, 60);
      }
    },
    [measureAndScroll],
  );

  const flattenedStyle = StyleSheet.flatten(contentContainerStyle);
  const basePaddingBottom =
    typeof flattenedStyle?.paddingBottom === 'number'
      ? flattenedStyle.paddingBottom
      : typeof flattenedStyle?.padding === 'number'
        ? flattenedStyle.padding
        : 0;

  const scrollView = (
    <ScrollView
      ref={scrollRef}
      keyboardShouldPersistTaps="handled"
      scrollEventThrottle={16}
      onScroll={(event) => {
        scrollOffsetRef.current = event.nativeEvent.contentOffset.y;
        onScroll?.(event);
      }}
      contentContainerStyle={[
        contentContainerStyle,
        androidKeyboardPadding > 0 && {
          paddingBottom: basePaddingBottom + androidKeyboardPadding,
        },
      ]}
      {...rest}>
      {children}
    </ScrollView>
  );

  return (
    <KeyboardScrollContext.Provider value={{ scrollToInput }}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView style={styles.flex} behavior="padding">
          {scrollView}
        </KeyboardAvoidingView>
      ) : (
        scrollView
      )}
    </KeyboardScrollContext.Provider>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});
