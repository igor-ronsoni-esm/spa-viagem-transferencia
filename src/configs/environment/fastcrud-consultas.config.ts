export default class FastcrudConsultasConfig {
  private static instance: FastcrudConsultasConfig;

  public buscarLinhasTransferencia: string
  public buscarTrechosPorLinhaTransferencia: string;
  public buscarVeiculos: string;
  public buscarMotoristas: string;

  private constructor() {
    this.buscarLinhasTransferencia = ""
    this.buscarTrechosPorLinhaTransferencia = ""
    this.buscarVeiculos = "c9f3b861-7e14-4a20-d596-2b38a0e57c19"
    this.buscarMotoristas = "";
  }

  public static get(): FastcrudConsultasConfig {
    if (!FastcrudConsultasConfig.instance)
      FastcrudConsultasConfig.instance = new FastcrudConsultasConfig();
    return FastcrudConsultasConfig.instance;
  }
}
