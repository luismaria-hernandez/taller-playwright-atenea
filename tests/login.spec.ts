import {test,expect} from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/dashboardPage";
import TestData from '../data/testData.json';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let usuario = TestData.login;

test.beforeEach (async ({page}) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.visitarPaginaLogin();
});

test('TC-7 Verificar inicio de sesion exitoso', async ({page}) =>{
    await loginPage.llenarFormularYlogin(usuario);
    await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
});



