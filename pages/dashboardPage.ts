import {Locator, Page} from "@playwright/test";

export class DashboardPage {

    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly botonDeAagregarCuenta: Locator;
    readonly botonEnviarDinero : Locator;

    constructor(page: Page){
        this.page= page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
        this.botonDeAagregarCuenta = page.getByTestId('tarjeta-agregar-cuenta');
        this.botonEnviarDinero = page.getByTestId('boton-enviar');
    }

    async irPaginaDashboard (){
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
    }

}