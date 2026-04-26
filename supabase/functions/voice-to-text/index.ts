
import "https://deno.land/x/xhr@0.1.0/mod.ts"
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Process base64 in chunks to prevent memory issues
function processBase64Chunks(base64String: string, chunkSize = 32768) {
  if (!base64String || base64String.length === 0) {
    throw new Error('Empty base64 string provided');
  }
  
  const chunks: Uint8Array[] = [];
  let position = 0;
  
  while (position < base64String.length) {
    const chunk = base64String.slice(position, position + chunkSize);
    const binaryChunk = atob(chunk);
    const bytes = new Uint8Array(binaryChunk.length);
    
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    
    chunks.push(bytes);
    position += chunkSize;
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { audio } = await req.json()
    
    if (!audio) {
      throw new Error('No audio data provided')
    }

    console.log(`Received audio data length: ${audio.length}`);
    
    if (audio.length === 0) {
      throw new Error('Empty audio data received');
    }
    
    // Process audio in chunks
    const binaryAudio = processBase64Chunks(audio)
    
    // Create blob from binary data with correct MIME type
    const audioBlob = new Blob([binaryAudio], { type: 'audio/webm;codecs=opus' })
    
    // Prepare form data for DeepSeek API
    const formData = new FormData()
    formData.append('file', audioBlob, 'audio.webm')
    formData.append('language', 'auto') // Automatically detect language
    formData.append('task', 'transcribe')
    
    console.log('Sending audio to DeepSeek API...')
    
    try {
      // Send to DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('DEEPSEEK_API_KEY')}`,
        },
        body: formData,
      })

      console.log(`DeepSeek API response status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('DeepSeek API error:', errorText);
        throw new Error(`DeepSeek API error: ${response.status} - ${errorText}`);
      }

      const responseText = await response.text();
      console.log('DeepSeek API raw response:', responseText);
      
      // Only try to parse as JSON if we have a response
      let result;
      if (responseText && responseText.trim()) {
        try {
          result = JSON.parse(responseText);
          console.log('DeepSeek API parsed response:', result);
        } catch (e) {
          console.error('Failed to parse DeepSeek API response as JSON:', e);
          throw new Error(`Invalid JSON response from DeepSeek API: ${responseText.substring(0, 100)}...`);
        }
      } else {
        throw new Error('Empty response from DeepSeek API');
      }
      
      return new Response(
        JSON.stringify({ text: result.text || 'No text detected' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    } catch (apiError) {
      console.error('API request error:', apiError);
      throw new Error(`API request failed: ${apiError.message}`);
    }
  } catch (error) {
    console.error('Error in voice-to-text function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})
