import { ComponentType } from 'react';
import WelcomeStep from './WelcomeStep';
import PersonalInfoStep from './PersonalInfoStep';
import HealthGoalsStep from './HealthGoalsStep';
import LifestyleStep from './LifestyleStep';
import WearablesStep from './WearablesStep';
import CompletionStep from './CompletionStep';

export interface StepConfig {
  title: string;
  component: ComponentType<any>;
}

const steps: StepConfig[] = [
  { title: 'Welcome', component: WelcomeStep },
  { title: 'Personal Info', component: PersonalInfoStep },
  { title: 'Health Goals', component: HealthGoalsStep },
  { title: 'Lifestyle', component: LifestyleStep },
  { title: 'Wearables', component: WearablesStep },
  { title: 'Complete', component: CompletionStep }
];

export default steps;
