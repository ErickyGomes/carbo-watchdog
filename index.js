const express = require('express');
const app = express();
const twilio = require('twilio');

let lastPulse = Date.now();
const TIMEOUT = 10 * 60 * 1000; // 10 minutos

// Endpoint que recebe o "estou vivo" da sua casa
app.post('/pulse', (req, res) => {
    lastPulse = Date.now();
    console.log("Pulso recebido da Carbo Pro!");
    res.status(200).send("OK");
});

// Checagem de segurança
setInterval(() => {
    if (Date.now() - lastPulse > TIMEOUT) {
        console.log("CASA OFFLINE! Enviando SMS...");
        // Aqui entra a lógica do Twilio que o Cursor vai configurar
    }
}, 60000); // Checa a cada minuto

app.listen(process.env.PORT || 3000);