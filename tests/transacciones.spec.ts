import { test, expect} from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalEnviarDinero } from '../pages/modalEnviarDinero';
import TestData from '../data/testData.json';

let dashboardPage: DashboardPage;
let modalEnviarDinero: ModalEnviarDinero;

//Esto se ve distinto que en el curso porque aparentemente ha habido una actualización sobre como usar el test extend
/*Lo que va a hacer esta prueba es usar los datos configurados de autenticación para usarlos en como directamente
como una prueba con los datos guardados en los archivos que se les indica*/

const testUsuarioEnvia = test.extend({
  storageState: './playwright/.auth/usuarioEnvia.json'
});

const testUsuarioRecibe = test.extend({
  storageState: './playwright/.auth/usuarioRecibe.json'
});

test.beforeEach( async ({page}) => {
    dashboardPage = new DashboardPage(page);
    modalEnviarDinero = new ModalEnviarDinero(page);
});

testUsuarioEnvia('TC-12 Validar la transacción exitosa', async ({page}) => {
    await dashboardPage.irPaginaDashboard()
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.botonEnviarDinero.click();
    await modalEnviarDinero.emailDestinatarioInput.fill(TestData.login.email);
    await modalEnviarDinero.cuentaOrigenDropdwn.click();
    await modalEnviarDinero.cuentaDeOrigen.click();
    await modalEnviarDinero.montoInput.fill('25');
    await modalEnviarDinero.botonEnviar.click();
    await expect(page.getByText('Transferencia enviada a '+(TestData.login.email).toString())).toBeVisible();

});

testUsuarioRecibe('TC-13 Validar que el usuario reciba una transferencia', async ({page}) => {
    await dashboardPage.irPaginaDashboard();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    
});