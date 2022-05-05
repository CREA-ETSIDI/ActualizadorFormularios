// Copyright © 2022 Echedey Luis
// This work is free. You can redistribute it and/or modify it under the
// terms of the Do What The Fuck You Want To Public License, Version 2,
// as published by Sam Hocevar. See the COPYING file for more details.

function resetRespuestas() {
  let form = FormApp.getActiveForm();
  form.getItemById("1060223384").asMultipleChoiceItem().setChoiceValues(opciones);
}

function clearForm(form) {
  let items = form.getItems();
  for (let i in items) {
    form.deleteItem(items[i]);
  }
  let responses = form.getResponses();
  for (let i in responses) {
    form.deleteResponse(responses[i].getId());
  }
  return;
}

// Créditos a Leo por ser tan guapo
function verItems_IDs() {
  let form = FormApp.getActiveForm();
  let items = form.getItems();
  for (let i in items)
  {
    Logger.log(i+' '+items[i].getTitle()+': '+items[i].getId()+' - '+items[i].getIndex());
  }
}

// Ver respuestas puestas a una pregunta
function verRespuestasItem() {
  let form = FormApp.getActiveForm();
  let item = form.getItemById("1060223384").asMultipleChoiceItem();
  let choices = item.getChoices();
  let choicesTxt = [];
  for (let ch in choices) {
    choicesTxt.push(choices[ch].getValue());
  }
  console.log(choicesTxt);
}
