
from flask import Flask, render_template, request

from flask_pymongo import PyMongo

# import request_tree


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


#################################################
# Flask Routes
#################################################

@app.route('/')
def index():
   return render_template('index.html')

@app.route('/about')
def about():
   return render_template('about.html')

@app.route('/bubble')
def search():
   return render_template('bubble.html')

@app.route('/bar')
def bar():
   return render_template('bar.html')

@app.route('/tree')
def tree():
   return render_template('tree.html')

@app.route('/map')
def map():
   return render_template('map.html')

@app.route('/result',methods = ['POST', 'GET'])
def result():
    if request.method == 'POST':
        user_input = request.form
        # print(result)
        # request_tree.request_new_tree(user_input)

        return render_template("result.html",user_input = user_input)

if __name__ == '__main__':
   app.run(debug = True)