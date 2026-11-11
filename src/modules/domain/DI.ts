import { ServiceContainer } from "@configs/service-container";
import ValidaJWTService from "./auth/services/valida-jwt.service";
import { ConsultarViagensService } from "./viagem/services/consultar-viagens.service";
import { ConsultarViagemPorCodigoExecucaoService } from "./viagem/services/consultar-viagem-por-codigo-execucao.service";
import BuscarTodasEmpresasService from "./empresa/services/buscar-todas-empresas.service";
import SalvarViagemService from "./viagem/services/salvar-viagem.service";
import BuscarTodosVeiculosService from "./veiculos/services/buscar-todos-veiculos.service";

const container = new ServiceContainer();

container.singleton("ValidaJWTUseCase", () => new ValidaJWTService());
container.singleton("ConsultarViagensUseCase", () => new ConsultarViagensService());
container.singleton("ConsultarViagemPorCodigoExecucaoUseCase", () => new ConsultarViagemPorCodigoExecucaoService());
container.singleton("BuscarTodasEmpresasUseCase", () => new BuscarTodasEmpresasService());
container.singleton("SalvarViagemUseCase", () => new SalvarViagemService());
container.singleton("BuscarTodosVeiculosUseCase", () => new BuscarTodosVeiculosService());


export { container };
