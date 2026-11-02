import { ServiceContainer } from "@configs/service-container";
import ValidaJWTService from "./auth/services/valida-jwt.service";
import DeparamTokenService from "./auth/services/deparam-permissions.service";
import { ConsultarViagensService } from "./viagem/services/consultar-viagens.service";
import { ConsultarViagemPorCodigoExecucaoService } from "./viagem/services/consultar-viagem-por-codigo-execucao.service";
import BuscarTodasEmpresasService from "./empresa/services/buscar-todas-empresas.service";


const container = new ServiceContainer();

container.singleton("ValidaJWTUseCase", () => new ValidaJWTService());
container.singleton("DeparamTokenUseCase", () => new DeparamTokenService());
container.singleton("ConsultarViagensUseCase", () => new ConsultarViagensService());
container.singleton("ConsultarViagemPorCodigoExecucaoUseCase", () => new ConsultarViagemPorCodigoExecucaoService());
container.singleton("BuscarTodasEmpresasUseCase", () => new BuscarTodasEmpresasService());

export { container };
