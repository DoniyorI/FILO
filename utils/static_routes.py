from flask import request, redirect
from utils.response import sendResponse , page_not_found
from utils.config import app


@app.route('/')
def serve_react_app():
    try:
        token = request.cookies.get("auth_tok")
        if not token:
            print("redirecting to login")
            return redirect("login")
        else:
            return sendResponse(filenamedir="./build/index.html", path=None, mimetype="text/html", xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()

@app.route('/static/css/<path:filename>')
def serve_static_css(filename):
    try:
        # response = send_from_directory('./build/static/css', filename)
        # response.headers['MIME type'] = 'text/css'
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/static/css", path=filename, mimetype="text/css", xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

@app.route('/static/js/<path:filename>')
def serve_static_js(filename):
    try:
        # response = send_from_directory('./build/static/js', filename)
        # response.headers['MIME type'] = 'text/javascript'
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/static/js", path=filename, mimetype="text/javascript", xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

@app.route('/image/<path:picture>')
def image(picture):
    try:
        
        # response = make_response(send_file(f'public/image/{picture}', mimetype="image/jpeg"))
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir=f"public/image{picture}", path=None, mimetype="image/jpeg", xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()    
    
@app.route('/static/media/<path:filename>')
def serve_svg(filename):
    try:
        # response = send_from_directory('./build/static/media', filename)
        # response.headers['mimetype'] = "image/svg+xml"
        # response.headers['X-Content-Type-Options'] = 'nosniff'
        # return response
        return sendResponse(filenamedir="./build/static/media", path=filename, mimetype="image/svg+xml", xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

