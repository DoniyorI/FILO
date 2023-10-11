from flask import Flask, send_file
# render_template will be useful for creating error pages if path is unknown

app = Flask(__name__)

@app.route('/')
def index():
    # send_file(relative path, mime-type)
    response = send_file("src/index.html", "text/html")
    response.headers['Content-Type'] = 'text/html'
    response.headers['X-Content-Type-Options'] = 'nosniff'
    return response

if __name__ == '__main__':
    # runs on localhost:8080 and useful for Docker
    # no need to call flask run anymore but just python app.py
        # if preferred: flask run -p 8080
    app.run(host='0.0.0.0', port=8080) 