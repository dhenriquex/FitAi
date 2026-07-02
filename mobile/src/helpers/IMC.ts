type IMCClassification = {
  label: string;
  color: string;
  backgroundColor: string;
};

export function calculateIMC(weight: number, height: number) {
  if (!weight || !height) return null;
  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function classifyIMC(imc: number): IMCClassification {
  if (imc < 18.5) {
    return { label: "Abaixo do peso", color: "#2563EB", backgroundColor: "#EFF4FF" };
  }
  if (imc < 25) {
    return { label: "Peso normal", color: "#16A34A", backgroundColor: "#EEF9F0" };
  }
  if (imc < 30) {
    return { label: "Sobrepeso", color: "#D97706", backgroundColor: "#FEF6E7" };
  }
  if (imc < 35) {
    return { label: "Obesidade grau I", color: "#EA580C", backgroundColor: "#FFF1E9" };
  }
  if (imc < 40) {
    return { label: "Obesidade grau II", color: "#DC2626", backgroundColor: "#FDEEEE" };
  }
  return { label: "Obesidade grau III", color: "#991B1B", backgroundColor: "#FBEAEA" };
}