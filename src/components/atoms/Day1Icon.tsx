import {
  Bell,
  Calendar,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  House,
  KeyRound,
  Mail,
  Minus,
  Pencil,
  Plus,
  Sun,
  Trash2,
  TrendingUp,
  TriangleAlert,
  User,
  type LucideIcon,
} from 'lucide-react-native';

import { useTheme } from '@/hooks/use-theme';

const ICONS = {
  bell: Bell,
  calendar: Calendar,
  calendarDays: CalendarDays,
  check: Check,
  chevronRight: ChevronRight,
  clock: Clock,
  home: House,
  key: KeyRound,
  mail: Mail,
  minus: Minus,
  edit: Pencil,
  plus: Plus,
  sun: Sun,
  trash: Trash2,
  trendingUp: TrendingUp,
  alert: TriangleAlert,
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
