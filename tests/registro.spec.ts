import { test, expect } from '@playwright/test';

test('Go to the main page', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await expect(page.locator('input[name=firstName]')).toBeVisible();
  await expect(page.locator('input[name=lastName]')).toBeVisible();
  await expect(page.locator('input[name=email]')).toBeVisible();
  await expect(page.locator('input[name=password]')).toBeVisible();
  await expect(page.getByTestId('boton-registrarse')).toBeVisible();
  await page.waitForTimeout(5000);
});

test('TC-2 Verificar que el botón de registro está inhablitado por defecto', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
  
});

test('TC-3 Verificar que el botón de registro se habilite al completar los campos del formulario', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill('juan@mail.com');
  await page.locator('input[name="password"]').fill('juan1234');
  await expect(page.getByTestId('boton-registrarse')).toBeEnabled();
});

test('TC-4 Verificar redirieccionamiento a la página de inicio', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.getByTestId('boton-login-header-signup').click();
  await expect(page).toHaveURL('http://localhost:3000/login');
});

/*Cuidado con este caso de prueba. Te va a fallar porque el mail ya ha sido registrado.
Se debería probar con otra dirección de mail*/

test('TC-5 Verificar registro exitoso', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill('juan@mail.com');
  await page.locator('input[name="password"]').fill('juan1234');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con un mail ya existente', async ({ page }) => {
  await page.goto('http://localhost:3000/signup');
  await page.locator('input[name="firstName"]').fill('Juan');
  await page.locator('input[name="lastName"]').fill('Torres');
  await page.locator('input[name="email"]').fill('juan@mail.com');
  await page.locator('input[name="password"]').fill('juan1234');
  await page.getByTestId('boton-registrarse').click();
  await expect(page.getByText('Email already in use')).toBeVisible();
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
});

