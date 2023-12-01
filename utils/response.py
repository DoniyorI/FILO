from flask import send_from_directory, make_response, send_file, Response

def sendResponse(filenamedir:str, path, xcontenttypeoptions:str, makeresponse:bool):
    if makeresponse:
        response = make_response(send_file(filenamedir))
        response.headers['X-Content-Type-Options'] = xcontenttypeoptions
        return response

    else:
        response = send_from_directory(filenamedir, path)
        response.headers['X-Content-Type-Options'] = xcontenttypeoptions
        return response

def page_not_found(error=None):
    return Response(
        response='HTTP/1.1 404 Not Found',
        status=404,
        headers={'X-Content-Type-Options': 'nosniff'}
    )