module.exports = (work) => {
  const moment = require('moment');
  return `
  
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <style>
          .container {
            width: 95%;
            margin: 0px auto;
            padding: 1px;
          }
          header {
            width: 100%;
            background-color: white;
            text-align: left;
          }
          header p,
          header h3 {
            color: rgb(95, 93, 93);
            font-family: Verdana, Geneva, Tahoma, sans-serif;
          }
    
          .main-header {
            background-color: rgb(246, 245, 245);
            display: flex;
            padding: 0px 5px;
            align-items: flex-end;
          }
          .datos-cliente {
          }
          section > h2 {
            text-transform: capitalize;
            font-size: 30px;
            text-align: center;
            text-decoration: underline;
          }
          .equipo p {
            text-transform: capitalize;
          }
          .datos-cliente .cliente {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
          }
          footer {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          .fecha-entrega {
            padding: 10px;
            border: 2px solid black;
          }
          .fecha-entrega h3 {
            display: flex;
            justify-content: space-around;
          }
          .fecha-entrega p {
            display: flex;
            justify-content: center;
          }
          .orden-fecha {
            display: flex;
            justify-content: flex-end;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <header>
            <img src="" alt="" />
            <div class="info-header">
              <h3>SERVICIO Y REPARACIÓN DE TELÉFONOS CELULARES</h3>
              <p>CUIT: 20-37308578-3</p>
              <p>TRABICHET NICOLAS MAXIMILIANO</p>
              <p>JUJUY 1692 Piso:2 Dpto:A</p>
              <p>ROSARIO</p>
              <p>2000-SANTA FE</p>
            </div>
          </header>
          <main>
            <section class="main-header">
              <div class="fecha-orden">
                <h3>ORDEN DE SERVICIO TÉCNICO NRO :${work?.codigo}</h3>
                <h3 class="orden-fecha">Fecha :${moment(new Date()).format(
                  'DD-MM-YYYY HH:mm:ss'
                )}</h3>
              </div>
            </section>
            <h3>PRESUPUESTO Y DIAGNÓSTICO TÉCNICO:</h3>
            <section class="datos-cliente">
              <h2>datos del Cliente</h2>
              <div class="cliente">
                <p>Nombre y Apellido :${work?.cliente?.name}</p>
                <p>DNI :${work?.cliente?.dni}</p>
                <p>Direccion :${work?.cliente?.direction}</p>
                <p>Localidad :</p>
                <p>telefono :${work?.cliente?.phone1}</p>
                <p>E_mail :</p>
              </div>
            </section>
            <section class="datos-equipo">
              <h2>Datos del Equipo</h2>
              <div class="equipo">
                <p>Equipo a reparar(marca/modelo) :${work?.marca + ' - ' + work?.modelo} </p>
                <p>Imei : ${work?.emei} Codigo Desbloqueo :${
    work?.contrasena + '  ' + work?.patron
  }</p>
                <p>Observaciones :  ${work?.observaciones}</p>
                <p>Falla Encontrada :  ${work?.fachasEncontradas}</p>
                <p>Descripcion del trabajo a realizar : ${work?.descripcion}</p>
                <p>Precio de la reparacion : ${work?.precio} </p>
                <p>garantia de reparacion: 3 meses</p>
                <p>El equipo enciende :...</p>
              </div>
            </section>
            <section class="leyes">
              <h3>BASES Y CONDICIONES:</h3>
              <ol>
                <li>
                  La comunicación de la aceptación del presupuesto puede ser vía
                  telefónica, correo electrónico o presencial.
                </li>
                <li>
                  Para retirar el equipo es imprescindible presentar la ORDEN DE
                  SERVICIO TÉCNICO y el abono correspondiente al servicio efectuado.
                </li>
                <li>
                  Todo trabajo solicitado como “urgente”, tendrá un costo adicional.
                </li>
                <li>
                  Toda reparación efectuada tiene una garantía de 3 meses, contados
                  desde la fecha de entrega, quedando excluidas las fallas por: mala
                  manipulación, roturas o golpes, sobretensión o evidencia de
                  residuos líquidos, humedad, o si el equipo fue intervenido por un
                  tercero. Los equipos que ingresan mojados, no son sujetos a
                  garantía.
                </li>
                <li>
                  e invocar la garantía del equipo, nuestro servicio técnico
                  evaluará el funcionamiento del mismo y decidirá si aplica o no, y
                  en caso de hacerla efectiva el cliente deberá presentar toda la
                  documentación que se le ha entregado (incluyendo: Orden de
                  servicio y boleta o comprobante de pago entregada).
                </li>
                <li>
                  Todos los equipos llegados a este servicio técnico se considerarán
                  fuera de garantía y por tanto la reparación se facturará de
                  acuerdo con las tarifas vigentes.
                </li>
                <li>
                  La empresa solo se hace responsable por la reparación o servicio
                  detallado en la orden de servicio, pudiendo agregar nuevos ítems
                  si así fuera necesario, informando previamente al cliente.
                </li>
                <li>
                  El servicio técnico no se hace responsable de los datos o
                  información contenida en los equipos puestos a su disposición, ni
                  de cualquier supuesta pérdida de datos en cualquiera de las
                  unidades de almacenamiento. De ser necesario realizar un resguardo
                  de información, el cliente deberá solicitar dicho servicio.
                </li>
                <li>
                  Si pasado los 30 días, el propietario no retira sus componentes,
                  el costo sufre un incremento del 10%; pasados los 60 días, 20%;
                  pasados los 90 días el propietario pierde el derecho a reclamar
                  sus componentes, pudiendo el servicio técnico darle el uso que
                  crea pertinente sin necesidad de informar al cliente (Art. 1947
                  del Código Procesal Civil y Comercial).
                </li>
                <li>
                  El cliente libera de toda responsabilidad a la empresa de
                  cualquier tipo de falla, en equipos que son recepcionados sin
                  encender o no se encuentren operativos, o estén mojados, ya sea
                  porque están sin carga o porque tiene algún problema de software o
                  hardware. En la orden de servicio se dejará constancia en las
                  condiciones que ingresa el equipo a nuestros centros de
                  reparación.
                </li>
                <li>
                  Este servicio técnico garantiza total confidencialidad sobre los
                  datos y/o archivos sensibles (contraseñas web, claves bancarias,
                  etc) que puedan encontrarse dentro de los equipos puestos a su
                  disposición.
                </li>
                <li>
                  Todo costo ocasionado por el traslado del equipo, será a cargo del
                  cliente. En casos de traslado, para que tenga validez, estará
                  sujeto a la firma de conformidad y recepción del servicio técnico.
                  13. Dejar el equipo en reparación SIGNIFICA ACEPTAR TODAS LAS
                  CONDICIONES DE TRABAJO ANTES DESCRIPTAS.
                </li>
              </ol>
            </section>
          </main>
          <footer class="footer">
            <section class="firmas">
              <h3>DATOS DEL SERVICIO TÉCNICO y FIRMA</h3>
              <div class="firma-content">
                <p>Firma del cliente : ..................</p>
                <p>Aclaracion : ................</p>
                <p>DNI : ................... ................</p>
              </div>
            </section>
            <div class="fecha-entrega">
              <h3>
                <span>Entrega Equipo </span>
                <span>Fecha ....... </span>
              </h3>
              <p>Firma de Conformidad : ...................</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
    
    
    `;
};
