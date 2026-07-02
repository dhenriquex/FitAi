export type Goal =
  | "perder_gordura"
  | "ganhar_massa_muscular"
  | "definir_corpo"
  | "aumentar_forca"
  | "melhorar_condicionamento"
  | "melhorar_saude"
  | "manter_peso"
  | "ganhar_resistencia"
  | "melhorar_mobilidade";

export type ActivityLevel =
  | "sedentario"
  | "pouco_ativo"
  | "moderadamente_ativo"
  | "ativo"
  | "muito_ativo"
  | "atleta";

export type Experience = "iniciante" | "intermediario" | "avancado" | "especialista";

export type Injury =
  | "nenhuma"
  | "joelho"
  | "ombro"
  | "coluna"
  | "lombar"
  | "cervical"
  | "quadril"
  | "cotovelo"
  | "punho"
  | "tornozelo"
  | "tendinite"
  | "lesao_muscular"
  | "hernia_de_disco"
  | "outra";

export type Gender = "male" | "female" | "nonBinary" | "nonInformation";