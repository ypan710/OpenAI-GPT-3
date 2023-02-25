import logging
import openai
import azure.functions as func

SECRET_KEY = "SECRET_KEY"

# sample request
# {"model": "text-davinci-003", "prompt": "What is hello world?", "max_tokens": 100, "temperature": 0}

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # give OpenAI secret key to authenticate
    openai.api_key = SECRET_KEY

    # get variables from HTTP request body
    req_body = req.get_json()
    logging.info(type(req_body))

    # call OpenAI's API
    output = openai.Completion.create(
    model = req_body["model"],
    prompt = req_body["prompt"],
    max_tokens = req_body["max_tokens"],
    temperature = req_body["temperature"]
    )

    # format the response to provide text only
    output_text = output["choices"][0]["text"]

    # provide the response
    return func.HttpResponse(output_text, status_code=200)

