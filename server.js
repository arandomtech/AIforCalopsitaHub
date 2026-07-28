const express = require('express');
const axios = require('axios');
const app = express();

app.use(express.json());

// Você pode usar a variável de ambiente GROQ_API_KEY no seu provedor (como Render)
const GROQ_API_KEY = process.env.GROQ_API_KEY || 'SUA_CHAVE_DA_GROQ_AQUI';

app.post('/ask-ai', async (req, res) => {
    try {
        const userPrompt = req.body.prompt;
        if (!userPrompt) {
            return res.status(400).json({ error: 'Nenhum prompt foi enviado o.o' });
        }

        const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
            model: 'llama-3.3-70b-versatile',
            messages: [
                {
                    role: 'system',
                    content: 'Você é um especialista absoluto no jogo do Roblox chamado Steal a Brainrot (SAB). O seu objetivo é responder a riddles, charadas e perguntas sobre o jogo. Responda SEMPRE de forma extremamente direta, curta e com letras maiúsculas (ex: RONALDO, SPAIN, FRIDAY, CURSED, 24), contendo apenas a palavra ou termo da resposta, sem pontuação extra ou explicações.'
                },
                { role: 'user', content: userPrompt }
            ],
            max_tokens: 15,
            temperature: 0.1
        }, {
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        
        const answer = response.data.choices[0].message.content.trim().toUpperCase();
        res.json({ answer: answer });
    } catch (err) {
        console.error('Erro na API da Groq:', err.response?.data || err.message);
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando fofameeeeente na porta ${PORT} ~ 🌸`);
});
