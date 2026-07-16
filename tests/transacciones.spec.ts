import { test, expect} from '@playwright/test';
import { DashboardPage } from '../pages/dashboardPage';
import { ModalEnviarDinero } from '../pages/modalEnviarDinero';
import TestData from '../data/testData.json';
import fs from 'fs/promises';  //Es una api que nos permite devolver promesas dentro de un archivo.
import path from 'path'; //Nos ayuda a encontrar archivos dentro de un directorio.
import { json } from 'stream/consumers';

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
    await modalEnviarDinero.montoInput.fill('100');
    await modalEnviarDinero.botonEnviar.click();
    await expect(page.getByText('Transferencia enviada a '+(TestData.login.email).toString())).toBeVisible();

});

testUsuarioRecibe('TC-13 Validar que el usuario reciba una transferencia', async ({page}) => {
    await dashboardPage.irPaginaDashboard();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    
});

//Test unificado que envía dinero por API y verfica por UI

testUsuarioRecibe('TC-14 Verificar transferencia recibida (enviada por API)', async ({page, request}) => {
  //#1 Preparación para lectura de datos y token del remitente

  //leemos el archivo de datos del usuario que envía para obtener su mail

  const usuarioEnviaData = './playwright/.auth/usuarioEnviaData.json';
  const usuarioEnviaContenidoData = await fs.readFile(usuarioEnviaData, 'utf-8');
  const datosUsuarioEnvia = JSON.parse(usuarioEnviaContenidoData);
  const emailUsuarioEnvia = datosUsuarioEnvia.email;
  
  await expect(emailUsuarioEnvia,'El email del usuario que envía no se leyó correctamente desde el archivo').toBeDefined(); //Con esto estamos diciendo que el email no sea nulo. Si el email resulta ser nulo, podemos imprimir un mensaje de error en la pantalla que es lo que definimos luego de la coma.

  //leemos el archivo de autenticación del remitente para obtener su JWT. Esto es el token de autenticación.

  const usuarioEnviaAuth = './playwright/.auth/usuarioEnvia.json';
  const usuarioEnviaContenidoAuth = await fs.readFile(usuarioEnviaAuth, 'utf-8');
  const contenidoAuthUsuarioEnvia = JSON.parse(usuarioEnviaContenidoAuth); 
  const tokenUsuario = contenidoAuthUsuarioEnvia.origins[0]?.localStorage.find((item: {name: string}) => item.name === 'jwt');
  //el signo de pregunta es un operador de encadenamiento opcional. Es un mecanismo para que nuestro código no se rompa. Impide que el código crashee.
  await expect(tokenUsuario, 'El JWT del usuario que envía no se leyó correctamente desde el archivo').toBeDefined();
  const jwt = tokenUsuario.value;

  //#2 Acción: Obtener cuenta y enviar transferencia via API

  //Primero, obtenemos la cuenta del remitente para daber el id de origen

  const respuestaDeCuentas = await request.get('http://localhost:6007/api/accounts', {
    headers: {
      'Authorization': `Bearer ${jwt}`
    }
  });
  await expect(respuestaDeCuentas.ok(), `La API para obtener cuentas falló : ${respuestaDeCuentas.status()}`).toBeTruthy(); //Esto me va a validar todas las respuetas del tipo 200 (desde 200 a 209). Si sale cualquier otra respuesta, me va a saltar el mensaje que hemos definido.
  const cuentas = await respuestaDeCuentas.json();
  await expect(cuentas.length, 'No se encontraron cuentas para el usuario').toBeGreaterThan(0);
  const idCuentaOrigen = cuentas[0]._id; //Tomamos el valor de ID de la primera cuenta

  const montoAleatorio = Math.floor(Math.random() * 100 + 1); // Math random genera un número entre 0 y 1, eso lo multiplica por cien para obtener un número decimal, a eso se le suma 1 y luego math floor redondea hacia abajo
  console.log('Enviando transferencia de $'+montoAleatorio+' desde la cuenta '+idCuentaOrigen+'a '+TestData.login.email);

  const respuestaTransferencia = await request.post('http://localhost:6007/api/transactions/transfer', {
    headers: {
      'Authorization': `Bearer ${jwt}`
    },
    data: {
      fromAccountId: idCuentaOrigen,
      toEmail: TestData.login.email,
      amount: montoAleatorio
    }

  });
  await expect(respuestaTransferencia.ok(), `La API para transferir dinero falló: ${respuestaTransferencia.status()}`).toBeTruthy();

  //#3 Comprobar que el monto llegó al detinatario por UI

  await dashboardPage.irPaginaDashboard(); //La prueba fallaba mas que nada en porque no estaba la visita la página de dashboard a traves de la UI
  await page.reload();/*Recargamos la página para que se actualicen los datos */
  await page.waitForLoadState('networkidle');
  await expect(dashboardPage.dashboardTitle).toBeVisible();

  //validamos que se muestre el mail del remitente en de la transacción mas reciente
  await expect(dashboardPage.elementoListaTransferencia.first()).toContainText(emailUsuarioEnvia);

  //validamos que se muestre el monto correcto
  //Usamos una expresion regular para buscar el número (ej: 5.00)

  const montoRegex = new RegExp(String(montoAleatorio.toFixed(2))); //Esto es algo exlusivo de node, que crea un objeto del tipo RegExp tomando como parámetro un número decimal y fija las posiciones despues de la coma en dos.
  await expect(dashboardPage.elementosListaMontosTransferencia.first()).toContainText(montoRegex);

});