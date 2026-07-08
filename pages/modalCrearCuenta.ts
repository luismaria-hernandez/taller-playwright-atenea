import { Locator, Page } from "@playwright/test";

export class ModalCrearCuenta {

    readonly page: Page;
    readonly tipoDeCuentaDropDown: Locator;
    readonly montoInput: Locator;
    readonly botonCancelar: Locator;
    readonly botonCrearCuenta: Locator;

    constructor (page: Page) {
        this.page = page;
        this.tipoDeCuentaDropDown = page.getByRole('combobox', {name:'Tipo de cuenta *'} );
        this.montoInput = page.getByRole('spinbutton', {name: 'Monto inicial *'}); //El rol se lo sugirió la IA
        this.botonCancelar = page.getByTestId('boton-cancelar-crear-cuenta');
        this.botonCrearCuenta = page.getByTestId('boton-crear-cuenta');
    }

    async seleccionarTipoDeCuenta(tipoCuenta: string) {
        await this.tipoDeCuentaDropDown.click();
        await this.page.getByRole('option', {name: tipoCuenta}).click();
    }

    async completarMonto(monto: string) {
        await this.montoInput.fill(monto);
    }

}