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
  let body = "";

  async function outputResult(body) {
    console.log(body);
    let response = await runAzure(body);
    console.log(response.output);
    document.getElementById("app-body").innerHTML = "<b> Summary </b> </br>" + response.output;
  }

  async function getBody() {
    // get contents of email
    Office.context.mailbox.item.body.getAsync("text", function (result) {
      if (result.status === Office.AsyncResultStatus.Succeeded) {
        body = result.value;
        outputResult(body);
      }
    });
  }

  async function runAzure(body) {
    const url = "https://openaigpts.azurewebsites.net/api/CompletionAPI";
    const content = {
      model: "text-davinci-003",
      prompt: `Summarize the following in 50 words or fewer: ${body
        .replace(/['"]+/g, "")
        .trim()
        .replace(/(\r\n|\n|\r|)/gm, "")}`,
      max_tokens: 200,
      temperature: 0,
    };
    const otherParam = {
      body: JSON.stringify(content),
      method: "POST",
    };
    const response = await fetch(url, otherParam);
    const output = await response.text();
    return { output };
  }

  await getBody();
}
