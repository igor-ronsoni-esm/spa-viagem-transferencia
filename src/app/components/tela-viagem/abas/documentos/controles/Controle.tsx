import { ControleOutput } from "@modules/domain/viagem/schemas/dados-viagem/documentos/controle.schema";
import ApresentacaoConhecimentos from "./ApresentacaoConhecimentos";

type Props = {
 controles: ControleOutput[]
}

type GrupoDestino = {
  destino: string;
  controles: ControleOutput[];
};

export default function Controle({ controles }: Readonly<Props>) {
  const agrupadoPorDestino = Object.values(controles.reduce((acc, item) => {
    const destinoKey = item.destino.descricao

    if (!acc[destinoKey]) {
      acc[destinoKey] = {
        destino: item.destino.descricao,
        controles: [],
      };
    }

    acc[destinoKey].controles.push({...item});

    return acc;
  }, {} as Record<string, GrupoDestino>));

  
  return agrupadoPorDestino.map((grupo, index) => <ApresentacaoConhecimentos key={index} grupo={grupo} />);
}