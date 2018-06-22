import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { Ng2SearchPipeModule } from 'ng2-search-filter'

import { AppComponent } from './app.component'
import { ProfileComponent } from './users/profile/profile.component'
import { LoginComponent } from './users/login/login.component'
import { RegisterComponent } from './users/register/register.component'
import { HomeComponent } from './home/home.component'
import { AuthenticationService } from './authentication.service'
import { AuthGuardService } from './auth-guard.service'
import { UserListComponent } from './users/user-list/user-list.component';
import { UserViewComponent } from './users/user-view/user-view.component';
import { UserUpdateComponent } from './users/user-update/user-update.component'

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: 'userList', component: UserListComponent, canActivate: [AuthGuardService] },
  { path: 'userUpdate/:id', component: UserUpdateComponent, canActivate: [AuthGuardService] },
  { path: 'userView/:id', component: UserViewComponent, canActivate: [AuthGuardService] }
];

@NgModule({
  declarations: [
    AppComponent,
    ProfileComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    UserListComponent,
    UserViewComponent,
    UserUpdateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    Ng2SearchPipeModule
  ],
  providers: [
    AuthenticationService,
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
