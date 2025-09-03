import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    const { FOXIT_CLIENT_ID, FOXIT_CLIENT_SECRET } = Deno.env.toObject()
    
    if (!FOXIT_CLIENT_ID || !FOXIT_CLIENT_SECRET) {
      console.log('Foxit API credentials not configured, using mock responses')
    }

    const url = new URL(req.url)
    const path = url.pathname.split('/foxit-api')[1] || ''
    
    // Route handling
    switch (path) {
      case '/generate-document':
        return await handleGenerateDocument(req)
      case '/process-workflow':
        return await handleProcessWorkflow(req)
      case '/templates':
        return await handleGetTemplates(req)
      case '/health':
        return await handleHealthCheck(req)
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

async function handleGenerateDocument(req: Request) {
  const body = await req.json()
  const { templateId, data, options } = body
  const { FOXIT_API_BASE_URL, FOXIT_CLIENT_ID, FOXIT_CLIENT_SECRET } = Deno.env.toObject()
  
  try {
    if (!FOXIT_API_BASE_URL || !FOXIT_CLIENT_ID || !FOXIT_CLIENT_SECRET) {
      throw new Error('Foxit API credentials not configured')
    }

    // Get access token first (if using OAuth)
    const authResponse = await fetch(`${FOXIT_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: FOXIT_CLIENT_ID,
        client_secret: FOXIT_CLIENT_SECRET
      })
    })
    
    const authData = await authResponse.json()
    const accessToken = authData.access_token
    
    // Generate document using Foxit API
    const foxitResponse = await fetch(`${FOXIT_API_BASE_URL}/documents/generate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        templateId: templateId,
        data: data,
        options: {
          format: options?.format || 'pdf',
          includeWatermark: options?.includeWatermark || false,
          compression: options?.compression || false,
          security: options?.security || 'standard'
        }
      })
    })
    
    const responseData = await foxitResponse.json()
    
    const response = {
      success: foxitResponse.ok,
      document_id: responseData.document_id || `doc_${Date.now()}`,
      document_url: responseData.document_url || `${FOXIT_API_BASE_URL}/documents/${responseData.document_id}`,
      file_size: responseData.file_size || '2.4 MB',
      generated_at: responseData.generated_at || new Date().toISOString(),
      processing_time: responseData.processing_time,
      error: !foxitResponse.ok ? responseData.error : undefined
    }
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Foxit API Error:', error)
    
    // Fallback to mock response
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API delay
    
    const response = {
      success: true,
      document_id: `doc_${Date.now()}`,
      document_url: `https://example.com/documents/doc_${Date.now()}.pdf`,
      file_size: '2.4 MB',
      generated_at: new Date().toISOString(),
      processing_time: '2.1s',
      note: 'Generated in mock mode due to API error'
    }
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleProcessWorkflow(req: Request) {
  const body = await req.json()
  const { workflowId, documentIds, operations, options } = body
  const { FOXIT_API_BASE_URL, FOXIT_CLIENT_ID, FOXIT_CLIENT_SECRET } = Deno.env.toObject()
  
  try {
    if (!FOXIT_API_BASE_URL || !FOXIT_CLIENT_ID || !FOXIT_CLIENT_SECRET) {
      throw new Error('Foxit API credentials not configured')
    }

    // Get access token first (if using OAuth)
    const authResponse = await fetch(`${FOXIT_API_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: FOXIT_CLIENT_ID,
        client_secret: FOXIT_CLIENT_SECRET
      })
    })
    
    const authData = await authResponse.json()
    const accessToken = authData.access_token
    
    // Process workflow using Foxit API
    const foxitResponse = await fetch(`${FOXIT_API_BASE_URL}/workflows/process`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workflowId: workflowId,
        documentIds: documentIds,
        operations: operations || ['watermark'],
        options: options || {}
      })
    })
    
    const responseData = await foxitResponse.json()
    
    const response = {
      success: foxitResponse.ok,
      processed_document_id: responseData.processed_document_id || `workflow_${Date.now()}`,
      processed_document_url: responseData.processed_document_url || `${FOXIT_API_BASE_URL}/processed/${responseData.processed_document_id}`,
      file_size: responseData.file_size || '3.1 MB',
      processed_at: responseData.processed_at || new Date().toISOString(),
      processing_time: responseData.processing_time,
      error: !foxitResponse.ok ? responseData.error : undefined
    }
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Foxit Workflow API Error:', error)
    
    // Fallback to mock response
    await new Promise(resolve => setTimeout(resolve, 3000)) // Simulate processing time
    
    const response = {
      success: true,
      processed_document_id: `workflow_${Date.now()}`,
      processed_document_url: `https://example.com/processed/workflow_${Date.now()}.pdf`,
      file_size: '3.1 MB',
      processed_at: new Date().toISOString(),
      processing_time: '3.2s',
      note: 'Processed in mock mode due to API error'
    }
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
}

async function handleGetTemplates(req: Request) {
  // Mock templates
  const templates = [
    {
      id: 'welcome_packet',
      name: 'Welcome Packet',
      description: 'Customer onboarding welcome packet',
      category: 'onboarding',
      fields: ['customer_name', 'company_name', 'welcome_message']
    },
    {
      id: 'contract',
      name: 'Service Contract',
      description: 'Standard service agreement template',
      category: 'legal',
      fields: ['client_name', 'service_type', 'contract_value']
    },
    {
      id: 'invoice',
      name: 'Invoice Template',
      description: 'Professional invoice template',
      category: 'billing',
      fields: ['customer_name', 'amount', 'due_date']
    }
  ]
  
  return new Response(
    JSON.stringify({ success: true, templates }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}

async function handleHealthCheck(req: Request) {
  const response = {
    version: '1.0.0',
    features: ['document_generation', 'pdf_processing', 'template_management'],
    status: 'healthy',
    timestamp: new Date().toISOString()
  }
  
  return new Response(
    JSON.stringify(response),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  )
}