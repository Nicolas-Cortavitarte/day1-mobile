import {
  ArrowLeft,
  Bell,
  Calendar,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dumbbell,
  Flame,
  Footprints,
  HeartPulse,
  House,
  KeyRound,
  LogOut,
  Mail,
  Minus,
  Palette,
  Pencil,
  Plus,
  Repeat,
  Search,
  Shield,
  Smartphone,
  Sprout,
  Sun,
  Tag,
  Target,
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
  chevronDown: ChevronDown,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  clock: Clock,
  dumbbell: Dumbbell,
  edit: Pencil,
  flame: Flame,
  footprints: Footprints,
  heartPulse: HeartPulse,
  home: House,
  key: KeyRound,
  logOut: LogOut,
  mail: Mail,
  minus: Minus,
  palette: Palette,
  plus: Plus,
  repeat: Repeat,
  search: Search,
  shield: Shield,
  smartphone: Smartphone,
  sprout: Sprout,
  sun: Sun,
  tag: Tag,
  target: Target,
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
