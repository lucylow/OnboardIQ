import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { VONAGE_API_KEY, VONAGE_API_SECRET } = Deno.env.toObject()
    
    if (!VONAGE_API_KEY || !VONAGE_API_SECRET) {
      throw new Error('Vonage API credentials not configured')
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/vonage-api')[1] || ''
    
    // Route handling
    switch (path) {
      case '/start-verification':
        return await handleStartVerification(req)
      case '/check-verification':
        return await handleCheckVerification(req)
      case '/send-sms':
        return await handleSendSMS(req)
      case '/account-balance':
        return await handleAccountBalance(req)
      default:
        return new Response(
          JSON.stringify({ error: 'Endpoint not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})

async function handleStartVerification(req: Request) {
  const { phone_number, brand = "OnboardIQ" } = await req.json()
  
  // Mock response for demo
  const response = {
    requestId: `demo_${Date.now()}`,
    status: 'sent',
    message: 'Verification code sent successfully'
  }
  
  return new Response(
    JSON.stringify(response),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleCheckVerification(req: Request) {
  const { request_id, code } = await req.json()
  
  // Mock verification - accept 123456 as valid code
  const verified = code === '123456'
  
  const response = {
    verified,
    status: verified ? 'verified' : 'failed',
    message: verified ? 'Verification successful' : 'Invalid code'
  }
  
  return new Response(
    JSON.stringify(response),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleSendSMS(req: Request) {
  const { to, text } = await req.json()
  
  // Mock SMS response
  const response = {
    message: 'SMS sent successfully',
    data: {
      message_id: `sms_${Date.now()}`,
      remaining_balance: '15.50',
      message_price: '0.04',
      status: 'sent'
    }
  }
  
  return new Response(
    JSON.stringify(response),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleAccountBalance(req: Request) {
  // Mock account balance
  const response = {
    success: true,
    balance: 25.75,
    currency: 'USD',
    auto_reload: false,
    message: 'Account balance retrieved'
  }
  
  return new Response(
    JSON.stringify(response),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}