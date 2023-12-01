from flask import redirect, request

from utils.response import sendResponse , page_not_found

def serve_react_app():
    try:
        token = request.cookies.get("auth_tok")
        if not token:
            print("redirecting to login")
            return redirect("login")
        else:
            return sendResponse(filenamedir="./build/index.html", path=None, xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()

def serve_static_css(filename):
    try:
        return sendResponse(filenamedir="./build/static/css", path=filename, xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

def serve_static_js(filename):
    try:
        return sendResponse(filenamedir="./build/static/js", path=filename, xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

def image(picture):
    try:
        return sendResponse(filenamedir=f"public/image{picture}", path=None, xcontenttypeoptions="nosniff", makeresponse=True)
    except Exception:
        return page_not_found()    
    
def serve_svg(filename):
    try:
        return sendResponse(filenamedir="./build/static/media", path=filename, xcontenttypeoptions="nosniff", makeresponse=False)
    except Exception:
        return page_not_found()

