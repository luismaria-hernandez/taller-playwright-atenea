import { test, expect } from '@playwright/test';
import {RegisterPage} from '../pages/registerPage';

test('TC-1 Verificación de los elementos visuales de la página de registro', async ({ page }) => {

  const registerPage = new RegisterPage(page);
  
  await registerPage.visitarPaginaRegistro();
  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
  await page.waitForTimeout(5000);
});

test('TC-2 Verificar que el botón de registro está inhablitado por defecto', async ({ page }) => {
  
  const registerPage = new RegisterPage(page);

  await registerPage.visitarPaginaRegistro();
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
  
});

test('TC-3 Verificar que el botón de registro se habilite al completar los campos del formulario', async ({ page }) => {
  
  const registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();
  await registerPage.completarFormularioRegistro('Luis María','Hernandez','luisma@test.com','clave123');

  await expect(registerPage.registerButton).toBeEnabled();

});

test('TC-4 Verificar redirieccionamiento a la página de Login', async ({ page }) => {
  
  const registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();
  await registerPage.hacerClickBotonRegistro();
  await expect(page).toHaveURL('http://localhost:3000/login');

});

test('TC-5 Verificar registro exitoso', async ({ page }) => {
  
  const registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();

  registerPage.completarYhacerClickBotonRegistro('Luis Maria','Hernandez','luisma'+Math.random().toString()+'@test.com','clave123');
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con un mail ya existente', async ({ page }) => {
  
  const registerPage = new RegisterPage(page);
  const email = 'luisma'+Math.random().toString()+'@test.com';

  await registerPage.visitarPaginaRegistro();
  registerPage.completarYhacerClickBotonRegistro('Luis Maria','Hernandez',email,'clave123');
  await expect(page.getByText('Registro exitoso')).toBeVisible();

  await registerPage.visitarPaginaRegistro();
  registerPage.completarYhacerClickBotonRegistro('Luis Maria','Hernandez',email,'clave123');
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
  await expect(page.getByText('Email already in use')).toBeVisible();
  
});

