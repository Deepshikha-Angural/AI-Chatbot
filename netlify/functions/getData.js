const fetch = require("node-fetch"); 

exports.handler = async (event) => {
    const API_KEY = process.env.API_KEY; // secured key
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`);
    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
    
};
