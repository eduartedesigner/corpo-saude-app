/**
 * Tipos do banco de dados — Supabase
 * App Corpo e Saúde
 * 
 * Modelagem baseada no PRD v1.0
 */

// ========== AUTH & USERS ==========
export type UserRole = 'aluno' | 'instrutor' | 'recepcionista' | 'gestor' | 'admin';

export type Gender = 'masculino' | 'feminino' | 'outros' | 'prefiro_nao_opinar';

export type AgeRange = 'abaixo_18' | '18_29' | '30_45' | '46_59' | '60_plus';

export interface Profile {
  id: string;
  user_id: string;
  role: UserRole;
  full_name: string;
  phone: string;
  avatar_url?: string;
  unit_id?: string;
  created_at: string;
  updated_at: string;
}

// ========== UNIDADES ==========
export interface Unit {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone: string;
  is_active: boolean;
  created_at: string;
}

// ========== MQV — QUESTIONÁRIO ==========
export interface MqvAssessment {
  id: string;
  user_id: string;
  unit_id: string;
  status: 'in_progress' | 'completed';
  completed_at?: string;
  created_at: string;

  // Bloco 2: Perfil e Biometria
  height_cm?: number;
  weight_kg?: number;
  gender?: Gender;
  age_range?: AgeRange;
  is_pne?: boolean;

  // Bloco 3: Rotina e Trabalho
  work_hours?: WorkHours;
  work_type?: WorkType[];

  // Bloco 4: Mapeamento de Dor
  pain_level?: number; // 0-10
  pain_frequency?: PainFrequency;
  pain_locations?: PainLocation[];
  pain_side?: PainSide;
  pain_sensation?: PainSensation;

  // Bloco 5: Histórico de Saúde
  had_surgery?: boolean;
  uses_medication?: boolean;
  has_diabetes_hypertension?: boolean;
  had_fracture_injury?: boolean;
  diagnoses?: Diagnosis[];
  previous_treatments?: Treatment[];

  // Bloco 6: Fisiologia e Hábitos
  sleep_quality?: SleepQuality;
  hydration?: Hydration;
  bowel_health?: BowelHealth;
  digestion_issues?: DigestionIssue[];
  diet_quality?: DietQuality;

  // Bloco 7: Estilo de Vida e Metas
  physical_activity?: PhysicalActivity;
  is_smoker?: boolean;
  alcohol_use?: AlcoholUse;
  emotional_state?: EmotionalState;
  stress_level?: number; // 0-10
  commitment_level?: number; // 1-10
  goals?: Goal[];

  // PAR-Q
  parq_responses?: ParqResponse[];
  parq_passed?: boolean;

  // LGPD
  lgpd_consent?: boolean;
  lgpd_consent_at?: string;
}

// Enums MQV
export type WorkHours = '4_8h' | '8_10h' | '10_12h' | '12_plus' | 'sem_atividade';

export type WorkType =
  | 'muito_sentado'
  | 'muito_em_pe'
  | 'dirigindo'
  | 'exigencia_intelectual'
  | 'andando_muito'
  | 'esforco_fisico';

export type PainFrequency = 'diariamente' | 'algumas_vezes_semana' | 'raramente' | 'apenas_apos_esforco';

export type PainLocation =
  | 'cabeca' | 'pescoco' | 'ombros' | 'bracos'
  | 'coluna' | 'quadril' | 'pernas' | 'pes'
  | 'articulacoes' | 'nao_sinto_dores';

export type PainSide = 'direito' | 'esquerdo' | 'ambos';

export type PainSensation = 'pontada' | 'queimacao' | 'formigamento' | 'peso' | 'fisgada';

export type Diagnosis =
  | 'hernia' | 'artrite' | 'tendinite'
  | 'bursite' | 'escoliose' | 'nenhum';

export type Treatment = 'fisioterapia' | 'massagem' | 'quiropraxia' | 'outros' | 'nunca_fiz';

export type SleepQuality =
  | 'durmo_muito_bem'
  | 'acordo_cansado'
  | 'demoro_pegar_sono'
  | 'acordo_varias_vezes'
  | 'uso_medicacao';

export type Hydration = 'menos_4_copos' | '4_8_copos' | 'mais_8_copos';

export type BowelHealth = 'regular' | 'lento' | 'irregular';

export type DigestionIssue = 'inchaco' | 'gases' | 'azia' | 'nenhum';

export type DietQuality = 'equilibrada' | 'ultraprocessados' | 'pulando_refeicoes' | 'excesso_doces';

export type PhysicalActivity = 'sim_3x_plus' | 'sim_1_2x' | 'raramente' | 'sedentario';

export type AlcoholUse = 'socialmente' | 'diariamente' | 'raramente' | 'nao_consumo';

export type EmotionalState = 'ansioso' | 'irritado' | 'triste' | 'equilibrado';

export type Goal = 'eliminar_dores' | 'melhorar_postura' | 'mais_energia' | 'prevencao';

export interface ParqResponse {
  question_id: number;
  answer: boolean;
  details?: string;
}

// ========== TREINOS ==========
export type MuscleGroup =
  | 'peito' | 'costas' | 'ombros' | 'biceps' | 'triceps'
  | 'quadriceps' | 'gluteos' | 'posteriores' | 'abdomen'
  | 'panturrilhas' | 'trapezio' | 'antebracos' | 'obliquos';

export type ExerciseLevel = 'iniciante' | 'intermediario' | 'avancado';

export type SetType = 'normal' | 'aquecimento' | 'drop_set' | 'super_serie';

export interface Exercise {
  id: string;
  name: string;
  description?: string;
  instructions: string[];
  tips?: string[];
  primary_muscle: MuscleGroup;
  secondary_muscles?: MuscleGroup[];
  equipment?: string;
  level: ExerciseLevel;
  video_url?: string;
  thumbnail_url?: string;
  is_popular?: boolean;
  created_at: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  unit_id: string;
  instructor_id?: string;
  title: string;
  description?: string;
  status: 'ai_generated' | 'instructor_review' | 'approved' | 'active' | 'completed';
  generated_by: 'ai' | 'instructor' | 'manual';
  days: WorkoutDay[];
  created_at: string;
  updated_at: string;
  approved_at?: string;
}

export interface WorkoutDay {
  id: string;
  plan_id: string;
  day_number: number;
  title: string; // ex: "Dia 1 — Peito + Tríceps"
  target_muscles: MuscleGroup[];
  estimated_duration_min: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutExercise {
  id: string;
  day_id: string;
  exercise_id: string;
  exercise?: Exercise;
  order: number;
  sets: WorkoutSet[];
  rest_seconds: number;
  notes?: string;
  set_type?: SetType;
}

export interface WorkoutSet {
  set_number: number;
  target_reps: number;
  target_weight_kg?: number;
  is_warmup?: boolean;
}

// ========== EXECUÇÃO DE TREINO ==========
export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id: string;
  day_id: string;
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  exercises_completed: SessionExercise[];
  rpe?: number; // Rate of Perceived Exertion (1-10)
  notes?: string;
}

export interface SessionExercise {
  exercise_id: string;
  completed_sets: CompletedSet[];
  completed_at: string;
}

export interface CompletedSet {
  set_number: number;
  reps: number;
  weight_kg: number;
  is_pr?: boolean; // Personal Record
}

// ========== PROGRESSO ==========
export interface BodyMeasurement {
  id: string;
  user_id: string;
  measured_at: string;
  weight_kg?: number;
  body_fat_pct?: number;
  chest_cm?: number;
  waist_cm?: number;
  hip_cm?: number;
  bicep_left_cm?: number;
  bicep_right_cm?: number;
  thigh_left_cm?: number;
  thigh_right_cm?: number;
  photos?: {
    front_url?: string;
    side_url?: string;
    back_url?: string;
  };
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_workout_date: string;
  total_workouts: number;
  total_minutes: number;
}

// ========== ASSINATURAS ==========
export type SubscriptionPlan = 'mensal' | 'anual';
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trial';

export interface Subscription {
  id: string;
  user_id: string;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  price_brl: number;
  started_at: string;
  expires_at: string;
  canceled_at?: string;
  payment_gateway: 'asaas' | 'stripe' | 'app_store' | 'google_play';
  gateway_subscription_id?: string;
}

// ========== NOTIFICAÇÕES ==========
export interface NotificationPayload {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: 'workout_reminder' | 'streak' | 'promotion' | 'instructor' | 'system';
  data?: Record<string, unknown>;
  read: boolean;
  created_at: string;
}
