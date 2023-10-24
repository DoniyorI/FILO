from flask import send_from_directory, make_response, send_file


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