from flask import Flask, jsonify, request

app = Flask(__name__)
app.config['ENV'] = 'development'
app.config['DEBUG'] = True
app.config['TESTING'] = True


@app.route("/")
def run():
    print("Hello World")
    print(request.get_json()['file'])
    return jsonify(Sentence='SENTENCE OUTPUT', fillers= 'FILLER OUTPUT' , FillersPercentage= 110 , WordCount= 11111)


if __name__ == '__main__':
    app.run(debug=True)
