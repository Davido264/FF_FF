import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JWT_OPTIONS, JwtModule } from "@auth0/angular-jwt";
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './Components/login/login.component';
import { LayoutComponent } from './Components/layout/layout.component';
import { SharedModule } from './Reutilizable/shared/shared.module';
import { UtilidadService } from './Reutilizable/utilidad.service';
import { environment } from 'src/environments/environment.prod';

export function tokenGetter(userService: UtilidadService) {
  return {
    tockenGetter: () => userService.obtenerSesionUsuario()?.token ?? "",
    allowedDomains: [ environment.endPoint.replace(/http[s]?:\/\//,"") ],
    disallowedRoutes: [
      `${environment.endPoint}Usuario/IniciarSesion`,
      `${environment.endPoint}Producto/Lista`,
      `${environment.endPoint}Categoria/Lista`,
    ],
  }
}

@NgModule({
  declarations: [AppComponent, LoginComponent, LayoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: tokenGetter,
        deps: [UtilidadService]
      }
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
