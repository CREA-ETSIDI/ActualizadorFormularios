// Copyright © 2022 Echedey Luis
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file for more details.

// Enumeración con las distintas opciones que se pueden presentar en la lista para elegir
const opciones = {
  asistenciaConPlaza:     'Intentaré asistir a todos los días (¡gratis!)',
  inscripcionListaEspera: 'Me inscribo en la lista de espera (¡lo siento, se agotaron las plazas!)'
}
// Item en el que cambian las respuestas dinámicamente
const itemListIndex = 2;
// Cantidad de inscripciones antes de que se dé el cambio de opciones
const maxInscripciones = 1;

// Copiado y alterado sin remordimientos de https://support.google.com/docs/thread/26659691/automatically-run-a-function-in-google-script-when-a-new-row-is-added-to-google-sheet?hl=en
function onSubmit(e) {
  if (!e) {
    return;
  }

  let lock = LockService.getScriptLock();
  let form = FormApp.getActiveForm();
  try {
    // Bloqueamos el script para que no se ejecuten múltiples hilos simultáneamente
    lock.waitLock(60 * 1000); // Después de dicho tiempo (ms), emite un error si no ha podido tomar el 'Lock'

    // Obtenemos el número de respuestas a partir del cuál hay que cerrar opciones
    let totalInscripciones = (form.getResponses()).length;
    console.info("Número de personas inscritas:" + totalInscripciones);
    //let clientesInscritos = countByResponseGiven(form);
    if (totalInscripciones >= maxInscripciones) {
      if (totalInscripciones == maxInscripciones) {
        GmailApp.sendEmail(Session.getActiveUser().getEmail(), 
          "Warning for form " + form.getTitle() + '!', 
          "Number of entries has reached " + maxInscripciones + "!\nYou should check the spreadsheet in case something went wrong..."); 
      }
      cambiarOpciones(form);
    }
  }
  catch (err) { // Reportamos cualquier error por correo para saber si se nos lía parda
    console.error(err);
    GmailApp.sendEmail(Session.getActiveUser().getEmail(), 
      "Error executing code for form " + form.getTitle() + '!', 
      "Gathered data from event:\nError: " + err + "e parameter: " + e); 
      // Solo era para probar la GmailApp, que si haces un trow puedes configurarlo para que te llegue al correo también
  }
  finally {
    // Devolvemos el Lock para que el siguiente hilo pueda continuar
    lock.releaseLock();
  }
}

// Esta función se puede ampliar fácilmente para que contemple más opciones de las que se escoja simultáneamente
// No me di cuenta de que para este tipo de encuesta con hacer (form.getResponses()).length bastaba hasta después de hacerlo
// Tiene su razón, y es que estaba cogiendo de base un código que lee de varias opciones. Hecho queda.
function countByResponseGiven(form) {
  let counter = 0;

  let formResponses = form.getResponses(); // Respuestas, como objeto de respuestas completas al formulario (submits)
  for (let i in formResponses) {
    let formResp = formResponses[i]; // Una respuesta al formulario
    let itemResponses = formResp.getItemResponses(); // Respuestas particulares a cada item
    let itemResp = itemResponses[itemListIndex]; // Respuesta al item específico, mediante index de la pregunta

    if (itemResp.getResponse() == opciones.asistenciaConPlaza) {
      counter++;
    }
  }
  console.info("Contador de 'opciones': " + counter);
  return counter;
}

// Función específica a cada formulario, actualiza la pregunta y sus respuestas
function cambiarOpciones(form) {
  form = FormApp.getActiveForm();
  let itemToChange = (form.getItems()[itemListIndex]).asMultipleChoiceItem(); // Cuidaito aquí que hay que poner el tipo que necesita la interfaz
  itemToChange.setChoiceValues([opciones.inscripcionListaEspera]);
  console.info("Las opciones han sido cambiadas con éxito");
  return;
}
