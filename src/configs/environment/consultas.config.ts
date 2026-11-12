export default class ConsultasConfig {
  private static instance: ConsultasConfig;

  public buscarLinhasTransferencia: string
  public buscarTrechosPorLinhaTransferencia: string;
  public buscarVeiculos: string;
  public buscarMotoristas: string;

  private constructor() {
    this.buscarLinhasTransferencia = ""
    this.buscarTrechosPorLinhaTransferencia = ""
    this.buscarVeiculos = "Consulta_De_Veiculos"
    this.buscarMotoristas = "Consulta_De_Motoristas_Cadastro_Viagem";
  }

  public static get(): ConsultasConfig {
    if (!ConsultasConfig.instance)
      ConsultasConfig.instance = new ConsultasConfig();
    return ConsultasConfig.instance;
  }
}
