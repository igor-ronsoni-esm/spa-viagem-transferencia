export default class FastcrudConsultasConfig {
  private static instance: FastcrudConsultasConfig;

  public buscarLinhasTransferencia: string
  public buscarTrechosPorLinhaTransferencia: string;
  public buscarVeiculos: string;
  public buscarMotoristas: string;

  private constructor() {
    this.buscarLinhasTransferencia = ""
    this.buscarTrechosPorLinhaTransferencia = ""
    this.buscarVeiculos = ""
    this.buscarMotoristas = "";
  }

  public static get(): FastcrudConsultasConfig {
    if (!FastcrudConsultasConfig.instance)
      FastcrudConsultasConfig.instance = new FastcrudConsultasConfig();
    return FastcrudConsultasConfig.instance;
  }
}
