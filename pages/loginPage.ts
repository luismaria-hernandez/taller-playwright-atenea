import {Locator, Page} from "@playwright/test";

export class LoginPage {

    readonly page: Page;
    readonly inputMail: Locator;
    readonly inputPassword: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.inputMail = page.locator('input[name="email"]');
        this.inputPassword = page.locator('input[name="password"]');
        this.loginButton = page.getByTestId('boton-login');
    }

    async visitarPaginaLogin(){
        await this.page.goto('http://localhost:3000/login');
    }

    async llenarFormulario(usuario: {email: string, password: string}){
        await this.inputMail.fill(usuario.email);
        await this.inputPassword.fill(usuario.password);
    }

    async presionarBotonInicioSesion() {
        await this.loginButton.click();
    }

    async llenarFormularYlogin(usuario: {email: string, password: string}){
        await this.llenarFormulario(usuario);
        await this.presionarBotonInicioSesion();

    }

}