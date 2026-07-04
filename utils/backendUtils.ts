import {APIRequestContext, Page, expect} from "@playwright/test";

export class BackendUtils {

    /*Al colocar el método como "static", no es necesario instanciar 
    la clase en otros archivos, directamente se llama a la clase y al método*/

    /*Lo que hace éste método es crear un usuario por el backend y retorna el mail
    con la clave para hacer el login*/

    static async enviarRequestDeBackend(request: APIRequestContext, usuario: any) {
        const email = 'juang'+Math.random().toString()+'@test.com';
        const response = await request.post('http://localhost:6007/api/auth/signup', {

            headers: {
                'Accept': 'application/vnd.github.v3+json',
                'Content-type': 'application/json'
            },
            data: {
                firstName: usuario.nombre,
                lastName: usuario.apellido,
                email: email,
                password: usuario.password
            }
        });
        await expect(response.status()).toBe(201);
        return {email: email, password: usuario.password};
    }

}