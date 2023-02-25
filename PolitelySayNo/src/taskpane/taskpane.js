/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

/* global document, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Outlook) {
    document.getElementById("sideload-msg").style.display = "none";
    document.getElementById("app-body").style.display = "flex";
    document.getElementById("run").onclick = run;
  }
});

export async function run() {
  /**
   * Insert your Outlook code here
   */
  const item = Office.context.mailbox.item;

  async function getBody() {
    // get body text from email
    Office.context.mailbox.item.body.getAsync("text", function (result) {
      // check result for success
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        const body = result.value;
        putItAllTogether(body);
      }
    });
  }

  async function runAPI(body) {
    const url = "https://openaigpts.azurewebsites.net/api/CompletionAPI";
    const otherNotes = document.getElementById("otherNotes").value;
    const content = {
      model: "text-davinci-003",
      prompt: `Reply to the following email say no politely and professionally, with this alternative: ${otherNotes}. The email is: ${body
        .replace(/['"]+/g, "")
        .trim()
        .replace(/(\r\n|\n|\r|)/gm, "")}`,
      max_tokens: 200,
      temperature: 0,
    };
    console.log(content);
    const otherParam = {
      body: JSON.stringify(content),
      method: "POST",
    };
    const response = await fetch(url, otherParam);
    const output = await response.text();
    return { output };
  }

  async function putItAllTogether(body) {
    console.log(body);
    const response = await runAPI(body);
    console.log(response.output);

    // reply email with decline request
    item.displayReplyForm(response.output);
  }

  await getBody();
}
