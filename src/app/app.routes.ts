import { Routes } from '@angular/router';
import { TodoComponent } from './todo/todo.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: "", component: TodoComponent },
    { path: "login", component: LoginComponent } 
];
