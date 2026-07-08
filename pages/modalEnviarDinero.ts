import {Locator, Page} from '@playwright/test';

export class ModalEnviarDinero {

    readonly page: Page;
    readonly emailDestinatarioInput: Locator;
    readonly cuentaOrigenDropdwn: Locator;
    readonly montoInput: Locator;
    readonly cuentaDeOrigen: Locator;
    readonly botonEnviar: Locator;

    constructor (page:Page) {
        this.page = page;
        this.emailDestinatarioInput = page.getByRole('textbox', { name: 'Email del destinatario *' });
        this.cuentaOrigenDropdwn = page.getByRole('combobox', { name: 'Cuenta origen *' });
        this.montoInput = page.getByRole('spinbutton', { name: 'Monto a enviar *' });
        this.cuentaDeOrigen = page.getByRole('option', { name: '••••' });
        this.botonEnviar = page.getByRole('button', {name:'ENVIAR'});
    }
}