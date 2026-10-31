import type { CompositeScreenProps } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import type { Activity } from '@/features/activities/types';

export type MainTabParamList = {
  Hoy: undefined;
  Calendario: undefined;
  Progreso: undefined;
  Perfil: undefined;
};

export type RootStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: undefined;
  Main: undefined;
  CreateActivity: undefined;
  ActivityDetail: { activity: Activity };
  EditActivity: { activity: Activity };
  RescheduleActivity: { activity: Activity };
};

export type MainTabScreenProps<T extends keyof MainTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<MainTabParamList, T>,
  NativeStackScreenProps<RootStackParamList>
>;