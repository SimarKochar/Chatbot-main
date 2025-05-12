from flask import Flask, render_template, request, jsonify
import requests
import os
import time
from dotenv import load_dotenv


load_dotenv()

app = Flask(__name__)
app.static_folder = 'static'

HF_API_TOKEN = os.getenv("HF_API_TOKEN", "") 

ROUTER_API_URL = "https://router.huggingface.co/novita/v3/openai/chat/completions"
MODEL = "deepseek/deepseek-prover-v2-671b"


if not HF_API_TOKEN:
    print("WARNING: No API token found. Please set your Hugging Face API token.")
    headers = {"Authorization": "Bearer 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"}  
else:
    headers = {"Authorization": f"Bearer {HF_API_TOKEN}"}

def query_huggingface_router(text_to_formalize):
    """Send request to Hugging Face Router API with retry logic"""
    max_retries = 3
    
    payload = {
        "messages": [
            {
                "role": "user",
                "content": f"Transform this informal text into formal language: {text_to_formalize}"
            }
        ],
        "model": MODEL,
        "temperature": 0.7,
        "max_tokens": 512
    }
    
    for attempt in range(max_retries):
        try:
            response = requests.post(ROUTER_API_URL, headers=headers, json=payload, timeout=60)
            
            if response.status_code == 429:
                if attempt < max_retries - 1:
                    print(f"Rate limited, retrying in {2**attempt} seconds...")
                    time.sleep(2**attempt)  
                    continue
            
            
            if response.status_code in [503, 500]:
                print(f"Server error (status {response.status_code}), waiting...")
                time.sleep(5) 
                continue
                
            response.raise_for_status()
            response_data = response.json()
            
            
            print(f"API Response: {response_data}")
            
            
            if "choices" in response_data and len(response_data["choices"]) > 0:
                return response_data["choices"][0]["message"]["content"]
            return "No valid response received from the API."
            
        except requests.exceptions.RequestException as e:
            print(f"API request error (attempt {attempt+1}/{max_retries}): {e}")
            if attempt < max_retries - 1:
                time.sleep(2**attempt)
            else:
               
                return "Error: Could not connect to the API. Please check your connection and API key."

def formalize_text(text):
    """Process text to make it more formal using Hugging Face router"""
    result = query_huggingface_router(text)
    
    
    if result.startswith("Error:"):
        formatted_text = text.replace("hey", "Hello").replace("just checking", "I am inquiring")
        formatted_text = formatted_text[0].upper() + formatted_text[1:] + "." if not formatted_text.endswith(".") else formatted_text
        return "I apologize, but I encountered an issue with the external API. Here is a basic formalization: " + formatted_text
    
    
    cleaned_result = result
    if cleaned_result.startswith("```") and cleaned_result.endswith("```"):
        cleaned_result = cleaned_result[3:-3].strip()
    elif cleaned_result.startswith('"') and cleaned_result.endswith('"'):
        cleaned_result = cleaned_result[1:-1].strip()
    cleaned_result = cleaned_result.strip('`')
    
    return cleaned_result

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    if request.method == 'POST':
        data = request.get_json()
        message = data.get('message', '')
        
        if not message:
            return jsonify({"answer": "Please provide some text to formalize."})
        
        formalized_text = formalize_text(message)
        return jsonify({"answer": formalized_text})

if __name__ == '__main__':
    app.run(debug=True)