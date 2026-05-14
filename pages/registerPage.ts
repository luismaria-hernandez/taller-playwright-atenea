import {Page, Locator} from "@playwright/test";

export class RegisterPage {
    readonly page: Page;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly registerButton: Locator;
    readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.firstNameInput = page.locator('input[name="firstName"]');
        this.lastNameInput = page.locator('input[name="lastName"]');
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.registerButton = page.getByTestId('boton-registrarse');
        this.loginButton = page.getByTestId('boton-login-header-signup');
    }

    async visitarPaginaRegistro(){
        await this.page.goto('http://localhost:3000/');
    }

    async completarFormularioRegistro(usuario: { nombre: string, apellido: string, email: string, password: string }) {

    await this.firstNameInput.fill(usuario.nombre);
    await this.lastNameInput.fill(usuario.apellido);
    await this.emailInput.fill(usuario.email);
    await this.passwordInput.fill(usuario.password);

    }

    async hacerClickBotonLogin(){
        await this.loginButton.click();
    }

    async hacerClickBotonRegistro(){
        await this.registerButton.click();
    }

    async completarYhacerClickBotonRegistro( nombre: string, apellido: string, email: string, password: string ) {
        await this.firstNameInput.fill(nombre);
        await this.lastNameInput.fill(apellido);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.hacerClickBotonRegistro();
    }

}