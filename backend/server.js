require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const authenticate = require('./src/authenticate');

const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.json());

async function getAccessToken() {
    const tokenUrl = process.env.CHAT_SERVICE_OAUTH_TOKEN_URL;
    const clientId = process.env.CHAT_SERVICE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.CHAT_SERVICE_OAUTH_CLIENT_SECRET;

    try {
        const accessToken = await authenticate(tokenUrl, clientId, clientSecret);
        return accessToken;
    } catch (error) {
        console.error('Error obtaining access token:', error);
        throw error; 
    }
}

app.get('/ping', async (req, res) => {
    const accessToken = await getAccessToken(); 
    const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
    const response = await axios.get(`${chatServiceUrl}/ping`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });
    res.status(response.status).send(response.data);
});

app.post('/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const accessToken = await getAccessToken(); 

        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.post(`${chatServiceUrl}/auth/login`, 
        {
            username: username,
            password: password,
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error login:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.post('/auth/register', async (req, res) => {
    try {
        const {email, password, username} = req.body;
        const accessToken = await getAccessToken(); 
        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.post(`${chatServiceUrl}/auth/register`, 
        {
            username: username,
            email: email,
            password: password,
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error register:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.get('/auth/allusers/:id', async (req, res) => {
    try {
        const id = req.params.id; 
        const accessToken = await getAccessToken(); 

        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.get(`${chatServiceUrl}/auth/allusers/${id}`, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error getting user:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});


app.get('/auth/logout/:id', async (req, res) => {
    try {
        const id = req.params.id; 
        const accessToken = await getAccessToken(); 

        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.get(`${chatServiceUrl}/auth/logout/${id}`, 
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error logging out:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.post('/auth/setavatar/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        const image = req.body.image;
        const accessToken = await getAccessToken(); 

        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.post(`${chatServiceUrl}/auth/setavatar/${id}`, 
        {
            image: image
        },
        {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error set avatar:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});


app.get('/messages/addmsg', async (req, res) => {
    try {
        const { from, to, message } = req.body;
        const accessToken = await getAccessToken(); 
        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.post(`${chatServiceUrl}/messages/addmsg`, 
        {
            from: from,
            to: to,
            message: message,
        },
        req.body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error register:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.post('/messages/getmsg', async (req, res) => {
    try {
        const { from, to } = req.body;
        const accessToken = await getAccessToken(); 
        const chatServiceUrl = process.env.CHAT_SERVICE_SERVICE_URL;
        const response = await axios.post(`${chatServiceUrl}/messages/getmsg`, 
        {
            from: from,
            to: to
        },
        req.body, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
        });
        res.status(response.status).send(response.data);
    } catch (error) {
        console.error('Error register:', error);
        res.status(error.response ? error.response.status : 500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
