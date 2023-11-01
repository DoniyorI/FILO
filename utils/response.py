from flask import send_from_directory, make_response, send_file, Response
from utils.config import app


def sendResponse(filenamedir:str, path, mimetype:str, xcontenttypeoptions:str, makeresponse:bool):
    if makeresponse:
        response = make_response(send_file(filenamedir, mimetype=mimetype))
        response.headers['X-Content-Type-Options'] = xcontenttypeoptions
        return response

    else:
        response = send_from_directory(filenamedir, path)
        response.headers['MIME type'] = mimetype
        response.headers['X-Content-Type-Options'] = xcontenttypeoptions
        return response

@app.errorhandler(404)
def page_not_found(error=None):
    return Response(
        response='HTTP/1.1 404 Not Found',
        status=404,
        mimetype="text/plain",
        headers={'X-Content-Type-Options': 'nosniff'}
    )