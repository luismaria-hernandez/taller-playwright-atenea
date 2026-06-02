import { test, expect, request } from '@playwright/test';
import {RegisterPage} from '../pages/registerPage';
import TestData from '../data/testData.json';

let registerPage: RegisterPage;
let usuario = TestData.usuarios;

test.beforeEach(async ({ page }) => {
  registerPage = new RegisterPage(page);
  await registerPage.visitarPaginaRegistro();
})


test('TC-1 Verificación de los elementos visuales de la página de registro', async ({ page }) => {

  await expect(registerPage.firstNameInput).toBeVisible();
  await expect(registerPage.lastNameInput).toBeVisible();
  await expect(registerPage.emailInput).toBeVisible();
  await expect(registerPage.passwordInput).toBeVisible();
  await expect(registerPage.registerButton).toBeVisible();
  await page.waitForTimeout(5000);
});

test('TC-2 Verificar que el botón de registro está inhablitado por defecto', async ({ page }) => {

  await expect(page.getByTestId('boton-registrarse')).toBeDisabled();
  
});

test('TC-3 Verificar que el botón de registro se habilite al completar los campos del formulario', async ({ page }) => {
  
  await registerPage.completarFormularioRegistro(usuario);
  await expect(registerPage.registerButton).toBeEnabled();

});

test('TC-4 Verificar redirieccionamiento a la página de Login', async ({ page }) => {
  
  await registerPage.hacerClickBotonLogin();
  await expect(page).toHaveURL('http://localhost:3000/login');

});

test('TC-5 Verificar registro exitoso', async ({ page }) => {

  await registerPage.completarYhacerClickBotonRegistro("Luis","Hernandez","luisma"+(Math.random()).toString()+"@test.com","clave123");
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

test('TC-6 Verificar que un usuario no pueda registrarse con un mail ya existente', async ({ page }) => {

  const email = 'luisma'+(Math.random()).toString()+'@test.com';

  registerPage.completarYhacerClickBotonRegistro('Luis Maria','Hernandez',email,'clave123');
  await expect(page.getByText('Registro exitoso')).toBeVisible();

  await registerPage.visitarPaginaRegistro();
  registerPage.completarYhacerClickBotonRegistro('Luis Maria','Hernandez',email,'clave123');
  await expect(page.getByText('Registro exitoso')).not.toBeVisible();
  await expect(page.getByText('Email already in use')).toBeVisible();
  
});

test('TC-8 Verificar registro exitoso con datos válidos verificando respuesta de la API', async ({page}) => {

  const email = 'luis'+(Math.random()).toString()+'@mail.com';
  const firstName = 'Luis María';
  const lastName = 'Hernandez';
  
  registerPage.completarYhacerClickBotonRegistro(firstName, lastName, email, 'clave123');
  
  const responsePromise = page.waitForResponse('http://localhost:6007/api/auth/signup');
  const response = await responsePromise;
  
  // Validar status de la respuesta
  expect(response.status()).toBe(201);
  
  // Obtener y parsear la respuesta JSON
  const responseBody = await response.json();
  
  // Validar estructura y contenido del token
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  
  // Validar que el token es un JWT válido (formato: header.payload.signature)
  const tokenParts = responseBody.token.split('.');
  expect(tokenParts).toHaveLength(3);
  
  // Validar estructura del objeto user
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toHaveProperty('id');
  expect(responseBody.user).toHaveProperty('firstName');
  expect(responseBody.user).toHaveProperty('lastName');
  expect(responseBody.user).toHaveProperty('email');
  
  // Validar valores del objeto user
  expect(typeof responseBody.user.id).toBe('string');
  expect(responseBody.user.firstName).toBe(firstName);
  expect(responseBody.user.lastName).toBe(lastName);
  expect(responseBody.user.email).toBe(email);
  
  // Validar que el mensaje de éxito se muestre en la UI
  await expect(page.getByText('Registro exitoso')).toBeVisible();
});

//Este caso de prueba es exactamente el mismo que el anterior pero la diferencia está en que en el TC-9 no pasamos por el frontend, directamente hacemos la llamada a la API.

test('TC-9 Verificar el signup desde la API', async ({page,request}) => {
  const email = 'luisma'+(Math.random()).toString()+'@mail.com';
  const response = await request.post('http://localhost:6007/api/auth/signup', {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    data: {
      firstName: TestData.usuarios.nombre,
      lastName: TestData.usuarios.apellido,
      email: email,
      password: TestData.usuarios.password
    }
  });
  const responseBody = await response.json();
  expect (response.status()).toBe(201);

});

/*Con esta prueba estamos haciendo un mock de las respuestas de las APIS para poder probar el comportamiento del front ante un fallo detenerminado.
Con esto no hace falta que el desarrollador tengo que dar de baja el servidor para ver como responde la app ante un error de servidor, por ejemplo*/

test('TC-10 Verificar el comportamiento de frontend ante una respuesta 500', async ({page}) => {
  const email = 'luisma'+(Math.random()).toString()+'@mail.com';

  await page.route('**/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({message: 'Error en el registro'})
    });
  });

  await registerPage.completarYhacerClickBotonRegistro(
    usuario.nombre,
    usuario.apellido,
    email,
    usuario.password
  );

});