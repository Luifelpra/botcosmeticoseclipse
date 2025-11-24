import os
import json
import requests
from flask import Flask, request, jsonify
from openai import OpenAI

app = Flask(__name__)

# ============ CONFIGURACIÓN ============

META_TOKEN = os.getenv("META_TOKEN")
META_PHONE_ID = os.getenv("META_PHONE_ID")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY)

# =======================================


# Enviar mensaje de WhatsApp / Instagram / Facebook
def send_message(to, message):
    url = f"https://graph.facebook.com/v20.0/{META_PHONE_ID}/messages"

    headers = {
        "Authorization": f"Bearer {META_TOKEN}",
        "Content-Type": "application/json"
    }

    data = {
        "messaging_product": "whatsapp",
        "to": to,
        "text": {"body": message}
    }

    try:
        r = requests.post(url, headers=headers, json=data)
        print("Meta response:", r.text)
        return r.json()
    except Exception as e:
        print("Error sending message:", e)
        return None


# Procesar texto con ChatGPT
def chatgpt_reply(user_message):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",  # O tu modelo de pago
            messages=[
                {"role": "system", "content": "Eres un asistente de tienda virtual que responde preguntas de productos, precios, disponibilidad y ayuda a realizar pedidos."},
                {"role": "user", "content": user_message}
            ]
        )

        return response.choices[0].message["content"]

    except Exception as e:
        print("OpenAI Error:", e)
        return "Lo siento, tuve un problema procesando tu mensaje."


# ============ ENDPOINTS ============

@app.route("/", methods=["GET"])
def verify():
    return "Bot activo en Railway 😎", 200


# Webhook de Meta
@app.route("/webhook", methods=["GET", "POST"])
def webhook():
    if request.method == "GET":
        mode = request.args.get("hub.mode")
        token = request.args.get("hub.verify_token")
        challenge = request.args.get("hub.challenge")

        if token == "luis_token_verificacion":  # Puedes cambiarlo
            return challenge
        return "Token incorrecto"

    if request.method == "POST":
        data = request.get_json()
        print("WEBHOOK:", json.dumps(data, indent=2))

        try:
            entry = data["entry"][0]
            changes = entry["changes"][0]
            value = changes["value"]

            messages = value.get("messages")
            if not messages:
                return "No message", 200

            msg = messages[0]
            phone = msg["from"]
            text = msg["text"]["body"]

            # Obtener respuesta del modelo
            reply = chatgpt_reply(text)

            # Enviar respuesta
            send_message(phone, reply)

        except Exception as e:
            print("Webhook error:", e)

        return "ok", 200


# ============ START ============

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
