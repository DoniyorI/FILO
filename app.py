from flask import Flask, send_file

app = Flask(__name__)

# get the root path for the index.html file
@app.route("/")
def index():
    response = send_file("src/index.html", "text/html")
    response.headers['Content-Type'] = 'text/html'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

if __name__ == '__main__':
    # runs on localhost:8080 and useful for Docker
    # no need to call flask run anymore but just python app.py
        # if preferred: flask run -p 8080
    app.run(host='0.0.0.0', port=8080) 