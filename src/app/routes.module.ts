import { NgModule } from "@angular/core";
import { RouterModule} from "@angular/router";
import { GlobalRoutes } from "./modules/global/global.routing";
import { medicoRoutes } from "./modules/medico/medico.routing";
import { pacienteRoutes } from "./modules/paciente/paciente.routing";
import { ingresoRoutes } from "./modules/ingreso/ingreso.routing";  
import { egresoRoutes } from "./modules/egreso/egreso.routing";


@NgModule({
    imports: [
        RouterModule.forChild([
            ...GlobalRoutes,
            ...medicoRoutes,
            ...pacienteRoutes,
            ...ingresoRoutes,
            ...egresoRoutes,
        ])
    ],
    exports: [RouterModule]
})
export class RoutesModule { }