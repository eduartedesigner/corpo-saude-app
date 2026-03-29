/**
 * MQV Step Screen — Questionário dinâmico
 * 
 * PRD Seção 5B: 7 blocos temáticos do MQV
 * Renderiza cada etapa com componentes apropriados
 */

import React, { useCallback } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ScreenContainer } from '../../src/components/layout';
import {
  Button,
  Text,
  H3,
  Input,
  ProgressBar,
  SelectCard,
  ScaleSlider,
} from '../../src/components/ui';
import { colors } from '../../src/theme/colors';
import { spacing } from '../../src/theme/spacing';
import { useMqvStore, MQV_TOTAL_STEPS } from '../../src/stores/mqvStore';
import type {
  Gender,
  AgeRange,
  WorkHours,
  WorkType,
  PainFrequency,
  PainLocation,
  PainSide,
  PainSensation,
  SleepQuality,
  Hydration,
  BowelHealth,
  DigestionIssue,
  DietQuality,
  PhysicalActivity,
  AlcoholUse,
  EmotionalState,
  Goal,
  Diagnosis,
  Treatment,
} from '../../src/types';

export default function MqvStepScreen() {
  const router = useRouter();
  const { step: stepParam } = useLocalSearchParams<{ step: string }>();
  const currentStep = parseInt(stepParam || '0', 10);

  const { answers, setAnswer, setAnswers } = useMqvStore();

  const progress = (currentStep + 1) / MQV_TOTAL_STEPS;

  const goNext = useCallback(() => {
    if (currentStep < MQV_TOTAL_STEPS - 1) {
      router.push(`/(onboarding)/mqv-step?step=${currentStep + 1}`);
    } else {
      router.push('/(onboarding)/mqv-result');
    }
  }, [currentStep, router]);

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      router.back();
    } else {
      router.back();
    }
  }, [currentStep, router]);

  // Toggle multi-select helper
  const toggleMultiSelect = <T extends string>(
    key: keyof typeof answers,
    value: T,
    current: T[] = []
  ) => {
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setAnswer(key as any, updated as any);
  };

  const renderStep = () => {
    switch (currentStep) {
      // ====== STEP 0: Validação inicial ======
      case 0:
        return (
          <StepContainer
            title="Vamos começar!"
            subtitle="Precisamos de algumas informações básicas"
            icon="👋"
          >
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              value={(answers as any).full_name || ''}
              onChangeText={(text) => setAnswer('full_name' as any, text)}
            />
            <View style={styles.checkboxRow}>
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  answers.lgpd_consent && styles.checkboxChecked,
                ]}
                onPress={() => setAnswer('lgpd_consent', !answers.lgpd_consent)}
              >
                {answers.lgpd_consent && (
                  <Text variant="bodySm" color={colors.white}>✓</Text>
                )}
              </TouchableOpacity>
              <Text variant="bodySm" color={colors.text.secondary} style={{ flex: 1 }}>
                Li e aceito os{' '}
                <Text variant="bodySm" color={colors.brand.red}>
                  Termos da Política de Privacidade
                </Text>
              </Text>
            </View>
          </StepContainer>
        );

      // ====== STEP 1: Perfil e Biometria ======
      case 1:
        return (
          <StepContainer
            title="Seu perfil"
            subtitle="Informações de saúde e biometria"
            icon="📋"
          >
            {/* Gênero */}
            <Text variant="label" style={styles.fieldLabel}>
              Gênero
            </Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'masculino', label: 'Masculino', icon: '♂️' },
                { value: 'feminino', label: 'Feminino', icon: '♀️' },
                { value: 'outros', label: 'Outros', icon: '⚧️' },
                { value: 'prefiro_nao_opinar', label: 'Prefiro não opinar', icon: '🤐' },
              ] as { value: Gender; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.gender === opt.value}
                  onPress={() => setAnswer('gender', opt.value)}
                  style={styles.halfCard}
                />
              ))}
            </View>

            {/* Faixa etária */}
            <Text variant="label" style={styles.fieldLabel}>
              Faixa etária
            </Text>
            <View style={styles.optionsList}>
              {([
                { value: 'abaixo_18', label: 'Abaixo de 18' },
                { value: '18_29', label: '18 a 29 anos' },
                { value: '30_45', label: '30 a 45 anos' },
                { value: '46_59', label: '46 a 59 anos' },
                { value: '60_plus', label: '+60 anos' },
              ] as { value: AgeRange; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.age_range === opt.value}
                  onPress={() => setAnswer('age_range', opt.value)}
                />
              ))}
            </View>

            {/* Altura e Peso */}
            <View style={styles.row}>
              <Input
                label="Altura (cm)"
                placeholder="170"
                keyboardType="numeric"
                value={answers.height_cm?.toString() || ''}
                onChangeText={(t) => setAnswer('height_cm', parseInt(t) || undefined as any)}
                containerStyle={{ flex: 1 }}
              />
              <Input
                label="Peso (kg)"
                placeholder="75"
                keyboardType="numeric"
                value={answers.weight_kg?.toString() || ''}
                onChangeText={(t) => setAnswer('weight_kg', parseInt(t) || undefined as any)}
                containerStyle={{ flex: 1 }}
              />
            </View>

            {/* PNE */}
            <Text variant="label" style={styles.fieldLabel}>
              Portador de Necessidades Especiais?
            </Text>
            <View style={styles.row}>
              <SelectCard
                label="Sim"
                selected={answers.is_pne === true}
                onPress={() => setAnswer('is_pne', true)}
                style={{ flex: 1 }}
              />
              <SelectCard
                label="Não"
                selected={answers.is_pne === false}
                onPress={() => setAnswer('is_pne', false)}
                style={{ flex: 1 }}
              />
            </View>
          </StepContainer>
        );

      // ====== STEP 2: Rotina e Trabalho ======
      case 2:
        return (
          <StepContainer
            title="Rotina e trabalho"
            subtitle="Como é o seu dia a dia?"
            icon="💼"
          >
            <Text variant="label" style={styles.fieldLabel}>
              Carga horária diária
            </Text>
            <View style={styles.optionsList}>
              {([
                { value: '4_8h', label: '4 a 8 horas' },
                { value: '8_10h', label: '8 a 10 horas' },
                { value: '10_12h', label: '10 a 12 horas' },
                { value: '12_plus', label: 'Mais de 12 horas' },
                { value: 'sem_atividade', label: 'Não tenho atividade obrigatória' },
              ] as { value: WorkHours; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.work_hours === opt.value}
                  onPress={() => setAnswer('work_hours', opt.value)}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>
              Tipo de trabalho (selecione todos que se aplicam)
            </Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'muito_sentado', label: 'Muito tempo sentado', icon: '🪑' },
                { value: 'muito_em_pe', label: 'Muito tempo em pé', icon: '🧍' },
                { value: 'dirigindo', label: 'Dirigindo muito', icon: '🚗' },
                { value: 'exigencia_intelectual', label: 'Exigência intelectual', icon: '🧠' },
                { value: 'andando_muito', label: 'Andando muito', icon: '🚶' },
                { value: 'esforco_fisico', label: 'Muito esforço físico', icon: '💪' },
              ] as { value: WorkType; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={(answers.work_type || []).includes(opt.value)}
                  onPress={() =>
                    toggleMultiSelect('work_type', opt.value, answers.work_type || [])
                  }
                  style={styles.halfCard}
                />
              ))}
            </View>
          </StepContainer>
        );

      // ====== STEP 3: Mapeamento da Dor ======
      case 3:
        return (
          <StepContainer
            title="Mapeamento da dor"
            subtitle="Onde e como você sente dor"
            icon="🩺"
          >
            <ScaleSlider
              label="Nível da dor hoje"
              min={0}
              max={10}
              value={answers.pain_level ?? 0}
              onChange={(v) => setAnswer('pain_level', v)}
              lowLabel="Sem dor"
              highLabel="Dor máxima"
            />

            <Text variant="label" style={styles.fieldLabel}>
              Frequência da dor
            </Text>
            <View style={styles.optionsList}>
              {([
                { value: 'diariamente', label: 'Diariamente' },
                { value: 'algumas_vezes_semana', label: 'Algumas vezes na semana' },
                { value: 'raramente', label: 'Raramente' },
                { value: 'apenas_apos_esforco', label: 'Apenas após esforço' },
              ] as { value: PainFrequency; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.pain_frequency === opt.value}
                  onPress={() => setAnswer('pain_frequency', opt.value)}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>
              Localização (selecione todas)
            </Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'cabeca', label: 'Cabeça', icon: '🧠' },
                { value: 'pescoco', label: 'Pescoço', icon: '🦒' },
                { value: 'ombros', label: 'Ombros', icon: '💪' },
                { value: 'bracos', label: 'Braços', icon: '🦾' },
                { value: 'coluna', label: 'Coluna', icon: '🦴' },
                { value: 'quadril', label: 'Quadril', icon: '🦿' },
                { value: 'pernas', label: 'Pernas', icon: '🦵' },
                { value: 'pes', label: 'Pés', icon: '🦶' },
                { value: 'articulacoes', label: 'Articulações', icon: '🔗' },
                { value: 'nao_sinto_dores', label: 'Não sinto dores', icon: '✅' },
              ] as { value: PainLocation; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={(answers.pain_locations || []).includes(opt.value)}
                  onPress={() =>
                    toggleMultiSelect('pain_locations', opt.value, answers.pain_locations || [])
                  }
                  style={styles.halfCard}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>
              Lateralidade
            </Text>
            <View style={styles.row}>
              {([
                { value: 'direito', label: 'Direito' },
                { value: 'esquerdo', label: 'Esquerdo' },
                { value: 'ambos', label: 'Ambos' },
              ] as { value: PainSide; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.pain_side === opt.value}
                  onPress={() => setAnswer('pain_side', opt.value)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>
              Sensação
            </Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'pontada', label: 'Pontada' },
                { value: 'queimacao', label: 'Queimação' },
                { value: 'formigamento', label: 'Formigamento' },
                { value: 'peso', label: 'Peso' },
                { value: 'fisgada', label: 'Fisgada' },
              ] as { value: PainSensation; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.pain_sensation === opt.value}
                  onPress={() => setAnswer('pain_sensation', opt.value)}
                  style={styles.halfCard}
                />
              ))}
            </View>
          </StepContainer>
        );

      // ====== STEP 4: Histórico de Saúde ======
      case 4:
        return (
          <StepContainer
            title="Histórico de saúde"
            subtitle="Informações médicas importantes"
            icon="🏥"
          >
            {/* Perguntas Sim/Não */}
            {([
              { key: 'had_surgery', label: 'Já realizou alguma cirurgia?' },
              { key: 'uses_medication', label: 'Faz uso de medicamento?' },
              { key: 'has_diabetes_hypertension', label: 'Possui diabetes ou hipertensão?' },
              { key: 'had_fracture_injury', label: 'Já sofreu fratura ou lesão grave?' },
            ] as const).map((q) => (
              <View key={q.key} style={styles.yesNoGroup}>
                <Text variant="label" style={styles.fieldLabel}>
                  {q.label}
                </Text>
                <View style={styles.row}>
                  <SelectCard
                    label="Sim"
                    selected={(answers as any)[q.key] === true}
                    onPress={() => setAnswer(q.key, true)}
                    style={{ flex: 1 }}
                  />
                  <SelectCard
                    label="Não"
                    selected={(answers as any)[q.key] === false}
                    onPress={() => setAnswer(q.key, false)}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            ))}

            <Text variant="label" style={styles.fieldLabel}>
              Diagnósticos (selecione todos)
            </Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'hernia', label: 'Hérnia' },
                { value: 'artrite', label: 'Artrite' },
                { value: 'tendinite', label: 'Tendinite' },
                { value: 'bursite', label: 'Bursite' },
                { value: 'escoliose', label: 'Escoliose' },
                { value: 'nenhum', label: 'Nenhum' },
              ] as { value: Diagnosis; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={(answers.diagnoses || []).includes(opt.value)}
                  onPress={() =>
                    toggleMultiSelect('diagnoses', opt.value, answers.diagnoses || [])
                  }
                  style={styles.halfCard}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>
              Tratamentos anteriores
            </Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'fisioterapia', label: 'Fisioterapia' },
                { value: 'massagem', label: 'Massagem' },
                { value: 'quiropraxia', label: 'Quiropraxia' },
                { value: 'outros', label: 'Outros' },
                { value: 'nunca_fiz', label: 'Nunca fiz' },
              ] as { value: Treatment; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={(answers.previous_treatments || []).includes(opt.value)}
                  onPress={() =>
                    toggleMultiSelect(
                      'previous_treatments',
                      opt.value,
                      answers.previous_treatments || []
                    )
                  }
                  style={styles.halfCard}
                />
              ))}
            </View>
          </StepContainer>
        );

      // ====== STEP 5: Fisiologia e Hábitos ======
      case 5:
        return (
          <StepContainer
            title="Fisiologia e hábitos"
            subtitle="Como funciona o seu corpo"
            icon="🫀"
          >
            <Text variant="label" style={styles.fieldLabel}>Qualidade do sono</Text>
            <View style={styles.optionsList}>
              {([
                { value: 'durmo_muito_bem', label: 'Durmo muito bem', icon: '😴' },
                { value: 'acordo_cansado', label: 'Acordo cansado', icon: '😫' },
                { value: 'demoro_pegar_sono', label: 'Demoro para pegar no sono', icon: '😵' },
                { value: 'acordo_varias_vezes', label: 'Acordo várias vezes', icon: '😰' },
                { value: 'uso_medicacao', label: 'Uso medicação para dormir', icon: '💊' },
              ] as { value: SleepQuality; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.sleep_quality === opt.value}
                  onPress={() => setAnswer('sleep_quality', opt.value)}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>Hidratação diária</Text>
            <View style={styles.row}>
              {([
                { value: 'menos_4_copos', label: '< 4 copos', icon: '💧' },
                { value: '4_8_copos', label: '4 a 8 copos', icon: '💧💧' },
                { value: 'mais_8_copos', label: '8+ copos', icon: '💧💧💧' },
              ] as { value: Hydration; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.hydration === opt.value}
                  onPress={() => setAnswer('hydration', opt.value)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>Funcionamento intestinal</Text>
            <View style={styles.row}>
              {([
                { value: 'regular', label: 'Regular' },
                { value: 'lento', label: 'Lento/Preso' },
                { value: 'irregular', label: 'Irregular' },
              ] as { value: BowelHealth; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.bowel_health === opt.value}
                  onPress={() => setAnswer('bowel_health', opt.value)}
                  style={{ flex: 1 }}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>Digestão (selecione todos)</Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'inchaco', label: 'Inchaço abdominal' },
                { value: 'gases', label: 'Gases' },
                { value: 'azia', label: 'Azia ou queimação' },
                { value: 'nenhum', label: 'Nenhum' },
              ] as { value: DigestionIssue; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={(answers.digestion_issues || []).includes(opt.value)}
                  onPress={() =>
                    toggleMultiSelect('digestion_issues', opt.value, answers.digestion_issues || [])
                  }
                  style={styles.halfCard}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>Alimentação</Text>
            <View style={styles.optionsList}>
              {([
                { value: 'equilibrada', label: 'Equilibrada', icon: '🥗' },
                { value: 'ultraprocessados', label: 'Rica em ultraprocessados', icon: '🍔' },
                { value: 'pulando_refeicoes', label: 'Pulando refeições', icon: '⏰' },
                { value: 'excesso_doces', label: 'Excesso de doces', icon: '🍰' },
              ] as { value: DietQuality; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.diet_quality === opt.value}
                  onPress={() => setAnswer('diet_quality', opt.value)}
                />
              ))}
            </View>
          </StepContainer>
        );

      // ====== STEP 6: Estilo de Vida e Metas ======
      case 6:
        return (
          <StepContainer
            title="Estilo de vida e metas"
            subtitle="Últimas perguntas — quase lá!"
            icon="🎯"
          >
            <Text variant="label" style={styles.fieldLabel}>Atividade física</Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'sim_3x_plus', label: '3x+ por semana', icon: '🔥' },
                { value: 'sim_1_2x', label: '1-2x por semana', icon: '👍' },
                { value: 'raramente', label: 'Raramente', icon: '😐' },
                { value: 'sedentario', label: 'Sedentário', icon: '🛋️' },
              ] as { value: PhysicalActivity; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.physical_activity === opt.value}
                  onPress={() => setAnswer('physical_activity', opt.value)}
                  style={styles.halfCard}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>Tabagismo</Text>
            <View style={styles.row}>
              <SelectCard label="Sim" selected={answers.is_smoker === true}
                onPress={() => setAnswer('is_smoker', true)} style={{ flex: 1 }} />
              <SelectCard label="Não" selected={answers.is_smoker === false}
                onPress={() => setAnswer('is_smoker', false)} style={{ flex: 1 }} />
            </View>

            <Text variant="label" style={styles.fieldLabel}>Álcool</Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'socialmente', label: 'Socialmente' },
                { value: 'diariamente', label: 'Diariamente' },
                { value: 'raramente', label: 'Raramente' },
                { value: 'nao_consumo', label: 'Não consumo' },
              ] as { value: AlcoholUse; label: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  selected={answers.alcohol_use === opt.value}
                  onPress={() => setAnswer('alcohol_use', opt.value)}
                  style={styles.halfCard}
                />
              ))}
            </View>

            <Text variant="label" style={styles.fieldLabel}>Estado emocional</Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'ansioso', label: 'Ansioso(a)', icon: '😰' },
                { value: 'irritado', label: 'Irritado(a)', icon: '😤' },
                { value: 'triste', label: 'Triste/Desanimado(a)', icon: '😔' },
                { value: 'equilibrado', label: 'Bem e Equilibrado(a)', icon: '😊' },
              ] as { value: EmotionalState; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={answers.emotional_state === opt.value}
                  onPress={() => setAnswer('emotional_state', opt.value)}
                  style={styles.halfCard}
                />
              ))}
            </View>

            <ScaleSlider
              label="Nível de estresse"
              min={0}
              max={10}
              value={answers.stress_level ?? 5}
              onChange={(v) => setAnswer('stress_level', v)}
              lowLabel="Sem estresse"
              highLabel="Muito estressado"
            />

            <ScaleSlider
              label="Comprometimento em mudar hábitos"
              min={1}
              max={10}
              value={answers.commitment_level ?? 5}
              onChange={(v) => setAnswer('commitment_level', v)}
              lowLabel="Pouco"
              highLabel="Totalmente"
            />

            <Text variant="label" style={styles.fieldLabel}>Objetivo principal</Text>
            <View style={styles.optionsGrid}>
              {([
                { value: 'eliminar_dores', label: 'Eliminar dores', icon: '🩹' },
                { value: 'melhorar_postura', label: 'Melhorar postura', icon: '🧘' },
                { value: 'mais_energia', label: 'Mais energia', icon: '⚡' },
                { value: 'prevencao', label: 'Prevenção', icon: '🛡️' },
              ] as { value: Goal; label: string; icon: string }[]).map((opt) => (
                <SelectCard
                  key={opt.value}
                  label={opt.label}
                  icon={opt.icon}
                  selected={(answers.goals || []).includes(opt.value)}
                  onPress={() =>
                    toggleMultiSelect('goals', opt.value, answers.goals || [])
                  }
                  style={styles.halfCard}
                />
              ))}
            </View>
          </StepContainer>
        );

      default:
        return null;
    }
  };

  const STEP_TITLES = [
    'Validação',
    'Perfil',
    'Rotina',
    'Dor',
    'Saúde',
    'Hábitos',
    'Metas',
  ];

  return (
    <ScreenContainer padded={false} edges={['top', 'bottom']}>
      {/* Header with progress */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={goBack}>
            <Text variant="bodyMd" color={colors.text.secondary}>
              ←
            </Text>
          </TouchableOpacity>
          <Text variant="labelSm" color={colors.text.tertiary}>
            {currentStep + 1} de {MQV_TOTAL_STEPS} · {STEP_TITLES[currentStep]}
          </Text>
          <View style={{ width: 24 }} />
        </View>
        <ProgressBar progress={progress} />
      </View>

      {/* Content */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderStep()}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom CTA */}
      <View style={styles.footer}>
        <Button
          title={currentStep < MQV_TOTAL_STEPS - 1 ? 'PRÓXIMO' : 'FINALIZAR AVALIAÇÃO'}
          onPress={goNext}
          size="lg"
          fullWidth
        />
      </View>
    </ScreenContainer>
  );
}

// ====== Step Container ======
function StepContainer({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.stepContainer}>
      <Text style={{ fontSize: 36, marginBottom: spacing[2] }}>{icon}</Text>
      <H3>{title}</H3>
      <Text variant="bodySm" color={colors.text.tertiary} style={{ marginBottom: spacing[6] }}>
        {subtitle}
      </Text>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: spacing[5],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
    gap: spacing[3],
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[8],
  },
  stepContainer: {
    flex: 1,
  },
  fieldLabel: {
    marginTop: spacing[5],
    marginBottom: spacing[3],
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  halfCard: {
    flexBasis: '47%',
    flexGrow: 1,
  },
  optionsList: {
    gap: spacing[2],
  },
  row: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  yesNoGroup: {
    marginBottom: spacing[2],
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    marginTop: spacing[4],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.dark.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.brand.red,
    borderColor: colors.brand.red,
  },
  footer: {
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[4],
    borderTopWidth: 1,
    borderTopColor: colors.dark.border,
  },
});
