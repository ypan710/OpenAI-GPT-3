import logging
import openai
import azure.functions as func

SECRET_KEY = "SECRET_KEY"

# sample request
{"prompt": "a white siamese cat", "n": 1, "size":"1024x1024"}

def main(req: func.HttpRequest) -> func.HttpResponse:
    logging.info('Python HTTP trigger function processed a request.')

    # give OpenAI secret key to authenticate
    openai.api_key = SECRET_KEY

    # get variables from HTTP request body
    req_body = req.get_json()
    logging.info(type(req_body))

    # call OpenAI's API
    response = openai.Image.create(
        prompt=req_body["prompt"],
        n=req_body["n"],
        size=req_body["size"]
    )

    # format the response to provide text only
    image_url = response['data'][0]['url']

    # provide the response
    return func.HttpResponse(image_url, status_code=200)

