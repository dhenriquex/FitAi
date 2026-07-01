import { Goal, ActivityLevel, Experience, Injury, Gender} from "@/types/profileTypes";
export const GOALS: { value: Goal; label: string }[] = [
  { value: "perder_gordura", label: "Perder gordura" },
  { value: "ganhar_massa_muscular", label: "Ganhar massa" },
  { value: "definir_corpo", label: "Definir corpo" },
  { value: "aumentar_forca", label: "Aumentar força" },
  { value: "melhorar_condicionamento", label: "Condicionamento" },
  { value: "melhorar_saude", label: "Saúde geral" },
  { value: "manter_peso", label: "Manter peso" },
  { value: "ganhar_resistencia", label: "Resistência" },
  { value: "melhorar_mobilidade", label: "Mobilidade" },
];

export const ACTIVITY_LEVELS: { value: ActivityLevel; label: string }[] = [
  { value: "sedentario", label: "Sedentário" },
  { value: "pouco_ativo", label: "Pouco ativo" },
  { value: "moderadamente_ativo", label: "Moderado" },
  { value: "ativo", label: "Ativo" },
  { value: "muito_ativo", label: "Muito ativo" },
  { value: "atleta", label: "Atleta" },
];

export const EXPERIENCES: { value: Experience; label: string }[] = [
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
  { value: "especialista", label: "Especialista" },
];

export const INJURIES: { value: Injury; label: string }[] = [
  { value: "nenhuma", label: "Nenhuma" },
  { value: "joelho", label: "Joelho" },
  { value: "ombro", label: "Ombro" },
  { value: "coluna", label: "Coluna" },
  { value: "lombar", label: "Lombar" },
  { value: "cervical", label: "Cervical" },
  { value: "quadril", label: "Quadril" },
  { value: "cotovelo", label: "Cotovelo" },
  { value: "punho", label: "Punho" },
  { value: "tornozelo", label: "Tornozelo" },
  { value: "tendinite", label: "Tendinite" },
  { value: "lesao_muscular", label: "Lesão muscular" },
  { value: "hernia_de_disco", label: "Hérnia de disco" },
  { value: "outra", label: "Outra" },
];

export const GENDERS: { value: Gender; label: string }[] = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "nonBinary", label: "Não-binário" },
  { value: "nonInformation", label: "Prefiro não informar" },
];
