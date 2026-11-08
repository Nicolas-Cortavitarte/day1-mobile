import {
  ArrowLeft,
  Bell,
  Calendar,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Dumbbell,
  House,
  KeyRound,
  LogOut,
  Mail,
  Minus,
  Palette,
  Pencil,
  Plus,
  Repeat,
  Smartphone,
  Sprout,
  Sun,
  Tag,
  Timer,
  Trash2,
  TrendingUp,
  TriangleAlert,
  User,
  type LucideIcon,
} from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

const ICONS = {
  alert: TriangleAlert,
  arrowLeft: ArrowLeft,
  bell: Bell,
  calendar: Calendar,
  calendarDays: CalendarDays,
  check: Check,
  chevronRight: ChevronRight,
  clock: Clock,
  dumbbell: Dumbbell,
  edit: Pencil,
  home: House,
  key: KeyRound,
  logOut: LogOut,
  mail: Mail,
  minus: Minus,
  palette: Palette,
  plus: Plus,
  repeat: Repeat,
  smartphone: Smartphone,
  sprout: Sprout,
  sun: Sun,
  tag: Tag,
  timer: Timer,
  trash: Trash2,
  trendingUp: TrendingUp,
  user: User,
} satisfies Record<string, LucideIcon>;

export type Day1IconName = keyof typeof ICONS;

type Day1IconProps = {
  name: Day1IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Day1Icon({ name, size = 20, color, strokeWidth = 2 }: Day1IconProps) {
  const colors = useTheme();
  const Icon = ICONS[name];

  return (
    <Icon
      size={size}
      color={color ?? colors.textPrimary}
      strokeWidth={strokeWidth}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
