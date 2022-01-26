// Copyright © 2022 Echedey Luis
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file for more details.

function initializeForm() {
  let form = FormApp.getActiveForm();
  
  // Borramos todo para empezar desde 0
  clearForm(form);

  // Datos básicos
  form.setTitle("Título de ejemplo")
      .setDescription("Formulario de ejemplo. \n\nMás texto de prueba XD");

  // Identificación del socix
  form.setCollectEmail(true);
  let nameField = form.addTextItem();
  nameField.setTitle("Nombre");
  nameField.setRequired(true);
  let surnameField = form.addTextItem();
  surnameField.setTitle("Primer apellido");
  surnameField.setRequired(true);

  // Pregunta de opción única
  let opts = form.addMultipleChoiceItem()
    .setTitle('Confirma que deseas inscribirte');
  opts.setChoiceValues([opciones.asistenciaConPlaza]);
  opts.setRequired(true);

  // Comprobamos que existe destino de las respuestas
  try {
    let responsesSpreadSheetId = form.getDestinationId(); // Si no hay directamente da error
    if (responsesSpreadSheetId != null) {
      console.info("ID de la hoja relacionada: " + responsesSpreadSheetId);
    }
  }
  catch (err) { // Si no hay, el error lo muestra este bloque
    console.error(err)
  }
}
