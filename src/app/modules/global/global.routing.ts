import { Route, Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";

export const GlobalRoutes: Routes = [
    {
        path: '',
        component: IndexComponent,
        loadChildren: () => import('./global.module').then(m => m.GlobalModule),

    }
];
