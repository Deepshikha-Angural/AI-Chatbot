const fetch = require("node-fetch"); 

exports.handler = async (event) => { 
    let body=JSON.parse(event.body);
    let text=body.text;
    const API_KEY = process.env.API_KEY; // secured key
   
    let requestOption={
        method:'POST',
        headers:{'Content-Type': 'application/json'}, 
        body:JSON.stringify(
            {
                "contents": [
                  {
                    "parts": [
                      {
                        "text": text
                      },
                      (body.doc.data ? [{"inline_data": body.doc}] : [])
                    ]
                  }
                ]
              }
        )
    }

    try{
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,requestOption);
        const data = await response.json();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: data.candidates[0].content.parts[0].text })
            // body: JSON.stringify({ message: data.message || data.text || 'No response received' })
        };
    }catch(e){
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to generate response' })
        };
    }

};
