from __future__ import absolute_import, division
from flask import Flask, request, make_response
from werkzeug.utils import secure_filename
import requests
from PIL import Image
from transformers import BlipProcessor, BlipForQuestionAnswering
import os
import torch
import torch.nn as nn
import numpy as np
from PIL import Image
from io import BytesIO
import requests
import torchvision.transforms as transforms
import json
import base64

import warnings

warnings.filterwarnings("ignore")

processor = BlipProcessor.from_pretrained("Salesforce/blip-vqa-base")
model = BlipForQuestionAnswering.from_pretrained("Salesforce/blip-vqa-base")

app = Flask(__name__)
# http_tunnel = ngrok.connect(8080) # ngrok 시작 및 Port 번호 전달
# tunnels = ngrok.get_tunnels() # ngrok forwording 정보

# for kk in tunnels: # Forwording 정보 출력
#     print(kk)
                                    
@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/send_check", methods = ['GET', 'POST'],)
def send_check():
    if request.method == "POST":
        text_data = request.form.get('text')
        image_file = request.files.get('image')
        
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
        
        img = Image.open(image_path).convert('RGB')
        question = str(text_data)       # "how many dogs are in the picture?"
        inputs = processor(img, question, return_tensors="pt")
        out = model.generate(**inputs)
        output = processor.decode(out[0], skip_special_tokens=True)
        json_string = {
            "message" : str(output)
        }
        
        json_object = json.dumps(json_string)
        response = make_response(json_object)
        response.headers['Content-Type'] = 'application/json'
        return response

@app.route("/send_per_check", methods = ['GET', 'POST'],)
def send_per_check():
    if request.method == "POST":
        image_file = request.files.get('image')
        
        filename = secure_filename(image_file.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        image_file.save(image_path)
        
        img = Image.open(image_path).convert('RGB')
        question = "the photograph of" # str(text_data)       # "how many dogs are in the picture?"
        inputs = processor(img, question, return_tensors="pt")
        out = model.generate(**inputs)
        output = processor.decode(out[0], skip_special_tokens=True)
        
        json_string = {
            "message" : str(output)
        }
        
        json_object = json.dumps(json_string)
        response = make_response(json_object)
        response.headers['Content-Type'] = 'application/json'
        return response
    
if __name__ == "__main__":
    # run_with_ngrok(app)
    app.config['UPLOAD_FOLDER'] = "/Users/wongipark/Desktop/Univ/2024_2/파란학기/image"
    app.run(host = "0.0.0.0", port = "8080", debug = True)       # 
    # ngrok http 8080
    
    # 96 * 32 