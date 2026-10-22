import { ServiceContainer } from "@configs/service-container";
import ValidaJWTService from "./auth/services/valida-jwt.service";
import DeparamTokenService from "./auth/services/deparam-permissions.service";
import { ConsultarViagensService } from "./viagem/services/consultar-viagens.service";


const container = new ServiceContainer();

container.singleton("ValidaJWTUseCase", () => new ValidaJWTService());
container.singleton("DeparamTokenUseCase", () => new DeparamTokenService());
container.singleton("ConsultarViagensUseCase", () => new ConsultarViagensService());

export { container };
