import {test as setup, expect, Page} from "@playwright/test";
import { BackendUtils } from "../utils/backendUtils";
import TestData from "../data/testData.json";
import { LoginPage } from "../pages/loginPage";
import { ModalCrearCuenta } from "../pages/modalCrearCuenta";
import { DashboardPage } from "../pages/dashboardPage";
import fs from 'fs/promises';  //Es una api que nos permite devolver promesas dentro de un archivo.
import path from 'path'; //Nos ayuda a encontrar archivos dentro de un directorio.


const usuarioEnviaAuthFile = "playwright/.auth/usuarioEnvia.json";
const usuarioRecibeAuthFile = "playwright/.auth/usuarioRecibe.json";
const usuarioEnviaDataFile = "playwright/.auth/usuarioEnviaData.json";

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

    //guardamos los datos del nuevo usuario para poder usarlo en los test de transacciones

    await fs.writeFile(path.resolve(__dirname,'..',usuarioEnviaDataFile), JSON.stringify(nuevoUsuario, null, 2)); //Los valores null y 2 son argumentos opcionales. Null se usa para decirle que no se aplique nigún filtro al objeto en caso de que se uno con muchos parámetro, y el 2 es para organizarlo en dos líneas para que sea legible.

    await loginPage.llenarFormularYlogin(nuevoUsuario);
    await dashboardPage.botonDeAagregarCuenta.click();
    await modalCrearCuenta.seleccionarTipoDeCuenta('Débito');
    await modalCrearCuenta.completarMonto('1000');
    await modalCrearCuenta.botonCrearCuenta.click();
    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
    await page.waitForTimeout(5000);
    
    await page.context().storageState({path: usuarioEnviaAuthFile}); //Context: Extrae el estado actual de la página y storageState guarda los datos de autenticación y almacenamiento del contexto

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