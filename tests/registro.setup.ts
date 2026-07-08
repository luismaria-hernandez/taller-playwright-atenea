import {test as setup, expect, Page} from "@playwright/test";
import { BackendUtils } from "../utils/backendUtils";
import TestData from "../data/testData.json";
import { LoginPage } from "../pages/loginPage";
import { ModalCrearCuenta } from "../pages/modalCrearCuenta";
import { DashboardPage } from "../pages/dashboardPage";

const usuarioEnviaAuthFile = "playwright/.auth/usuarioEnvia.json";
const usuarioRecibeAuthFile = "playwright/.auth/usuarioRecibe.json";

let loginPage: LoginPage;
let modalCrearCuenta: ModalCrearCuenta;
let dashboardPage: DashboardPage;

setup.beforeEach( async ({page}) => {
    loginPage = new LoginPage (page);
    modalCrearCuenta = new ModalCrearCuenta(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.visitarPaginaLogin();
});

setup('Generar usuario que envía dinero', async ({page,request}) => {
    const nuevoUsuario = await BackendUtils.enviarRequestDeBackend(request, TestData.usuarios);
   
    await loginPage.llenarFormularYlogin(nuevoUsuario);
    await dashboardPage.botonDeAagregarCuenta.click();
    await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
    await modalCrearCuenta.completarMonto('1000');
    await modalCrearCuenta.botonCrearCuenta.click();
    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
    await page.waitForTimeout(5000);
    
    await page.context().storageState({path: usuarioEnviaAuthFile});

});

setup('Generar usuario que recibe dinero', async ({page}) => {
    const usuarioValido = TestData.login;
   
    await loginPage.llenarFormularYlogin(usuarioValido);
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await page.context().storageState({path: usuarioRecibeAuthFile});
    
    /*await dashboardPage.botonDeAagregarCuenta.click();
    await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
    await modalCrearCuenta.completarMonto('1000');
    await modalCrearCuenta.botonCrearCuenta.click();
    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
    await page.waitForTimeout(5000);*/
    

});