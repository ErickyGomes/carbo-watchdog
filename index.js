const express = require('express');
const twilio = require('twilio');
const app = express();

// O Render injeta essas chaves automaticamente
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

let lastPulse = Date.now();
const TIMEOUT = 10 * 60 * 1000; // 10 minutos
let alertSent = false; 

// 1. Recebe o pulso da sua casa
app.post('/pulse', (req, res) => {
    lastPulse = Date.now();
    alertSent = false; // Reseta o alarme
    console.log("Pulso recebido. Status: ONLINE");
    res.status(200).send("OK");
});

// 2. O BOTÃO DE TESTE DE SMS
app.get('/test-sms', (req, res) => {
    client.messages.create({
        body: '🛠️ Teste Carbo Pro: Seu sistema de SMS de emergência está funcionando perfeitamente!',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: process.env.MY_CELLPHONE
    })
    .then(message => res.send(`SUCESSO! SMS enviado para seu celular. ID: ${message.sid}`))
    .catch(error => res.status(500).send(`ERRO NO TWILIO: ${error.message}`));
});

// 3. O Vigia Silencioso
setInterval(() => {
    if (Date.now() - lastPulse > TIMEOUT && !alertSent) {
        console.log("🚨 ALERTA: CASA OFFLINE! Disparando SMS...");
        client.messages.create({
            body: '🚨 ALERTA CRÍTICO: Carbo Pro Offline! A conexão com Cabreúva caiu por mais de 10 minutos. Verifique a energia/internet.',
            from: process.env.TWILIO_PHONE_NUMBER,
            to: process.env.MY_CELLPHONE
        })
        .then(() => alertSent = true)
        .catch(err => console.error(err));
    }
}, 60000);

app.listen(process.env.PORT || 3000);