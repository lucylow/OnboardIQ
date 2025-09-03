// Document Routes - Document generation, management, and workflow orchestration
const express = require('express');
const router = express.Router();

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid authentication token'
    });
  }

  const jwt = require('jsonwebtoken');
  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid token',
        message: 'The provided authentication token is invalid or expired'
      });
    }

    req.user = user;
    next();
  });
}

// Generate document using Foxit API
router.post('/generate', authenticateToken, async (req, res) => {
  try {
    const { templateId, data, options = {} } = req.body;

    if (!templateId || !data) {
      return res.status(400).json({
        error: 'Template ID and data are required'
      });
    }

    console.log(`📄 Generating document with template: ${templateId} for user: ${req.user.email}`);

    // Generate document using Foxit API
    const document = await req.integrations.foxit.generateDocument(templateId, data, options);

    // AI-powered document validation
    const validation = await req.ai.document.validateDocumentContent(document.content, templateId);

    return res.status(200).json({
      document: document,
      validation: validation,
      downloadUrl: document.downloadUrl,
      message: 'Document generated successfully'
    });

  } catch (error) {
    console.error('Document generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Generate personalized document
router.post('/generate-personalized', authenticateToken, async (req, res) => {
  try {
    const { documentType, userData, personalizationData = {} } = req.body;

    if (!documentType || !userData) {
      return res.status(400).json({
        error: 'Document type and user data are required'
      });
    }

    console.log(`📄 Generating personalized document: ${documentType} for user: ${req.user.email}`);

    // Generate personalized document using AI
    const document = await req.ai.document.generatePersonalizedDocument(
      documentType,
      userData,
      personalizationData
    );

    // Execute document workflow
    const workflow = await req.ai.document.executeDocumentWorkflow(document, userData);

    return res.status(200).json({
      document: document,
      workflow: workflow,
      downloadUrl: document.downloadUrl,
      message: 'Personalized document generated successfully'
    });

  } catch (error) {
    console.error('Personalized document generation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Compress document
router.post('/compress', authenticateToken, async (req, res) => {
  try {
    const { documentId, compressionLevel = 'medium' } = req.body;

    if (!documentId) {
      return res.status(400).json({
        error: 'Document ID is required'
      });
    }

    console.log(`🗜️ Compressing document: ${documentId}`);

    const compressedDocument = await req.integrations.foxit.compressDocument(documentId, {
      compressionLevel: compressionLevel
    });

    return res.status(200).json({
      originalDocumentId: documentId,
      compressedDocument: compressedDocument,
      compressionRatio: compressedDocument.compressionRatio,
      message: 'Document compressed successfully'
    });

  } catch (error) {
    console.error('Document compression error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Add watermark to document
router.post('/watermark', authenticateToken, async (req, res) => {
  try {
    const { documentId, watermarkText, options = {} } = req.body;

    if (!documentId || !watermarkText) {
      return res.status(400).json({
        error: 'Document ID and watermark text are required'
      });
    }

    console.log(`💧 Adding watermark to document: ${documentId}`);

    const watermarkedDocument = await req.integrations.foxit.addWatermark(documentId, watermarkText, options);

    return res.status(200).json({
      originalDocumentId: documentId,
      watermarkedDocument: watermarkedDocument,
      watermarkText: watermarkText,
      message: 'Watermark added successfully'
    });

  } catch (error) {
    console.error('Watermark addition error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Merge documents
router.post('/merge', authenticateToken, async (req, res) => {
  try {
    const { documentIds, mergeOrder = 'sequential' } = req.body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length < 2) {
      return res.status(400).json({
        error: 'At least two document IDs are required'
      });
    }

    console.log(`🔗 Merging documents: ${documentIds.join(', ')}`);

    const mergedDocument = await req.integrations.foxit.mergeDocuments(documentIds, {
      mergeOrder: mergeOrder
    });

    return res.status(200).json({
      sourceDocuments: documentIds,
      mergedDocument: mergedDocument,
      totalPages: mergedDocument.totalPages,
      message: 'Documents merged successfully'
    });

  } catch (error) {
    console.error('Document merge error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Convert document format
router.post('/convert', authenticateToken, async (req, res) => {
  try {
    const { documentId, targetFormat, options = {} } = req.body;

    if (!documentId || !targetFormat) {
      return res.status(400).json({
        error: 'Document ID and target format are required'
      });
    }

    console.log(`🔄 Converting document: ${documentId} to ${targetFormat}`);

    const convertedDocument = await req.integrations.foxit.convertFormat(documentId, targetFormat, options);

    return res.status(200).json({
      originalDocumentId: documentId,
      convertedDocument: convertedDocument,
      originalFormat: convertedDocument.originalFormat,
      targetFormat: targetFormat,
      message: 'Document converted successfully'
    });

  } catch (error) {
    console.error('Document conversion error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Execute document workflow
router.post('/workflow', authenticateToken, async (req, res) => {
  try {
    const { workflowType, documentId, userData, options = {} } = req.body;

    if (!workflowType || !documentId) {
      return res.status(400).json({
        error: 'Workflow type and document ID are required'
      });
    }

    console.log(`⚙️ Executing document workflow: ${workflowType} for document: ${documentId}`);

    const workflowResult = await req.integrations.foxit.executeDocumentWorkflow(
      workflowType,
      documentId,
      userData,
      options
    );

    return res.status(200).json({
      workflowType: workflowType,
      documentId: documentId,
      workflowResult: workflowResult,
      steps: workflowResult.steps,
      status: workflowResult.status,
      message: 'Document workflow executed successfully'
    });

  } catch (error) {
    console.error('Document workflow error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Validate document
router.post('/validate', authenticateToken, async (req, res) => {
  try {
    const { documentId, validationRules = [] } = req.body;

    if (!documentId) {
      return res.status(400).json({
        error: 'Document ID is required'
      });
    }

    console.log(`✅ Validating document: ${documentId}`);

    const validation = await req.integrations.foxit.validateDocument(documentId, validationRules);

    return res.status(200).json({
      documentId: documentId,
      validation: validation,
      isValid: validation.isValid,
      issues: validation.issues || [],
      message: 'Document validation completed'
    });

  } catch (error) {
    console.error('Document validation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get document templates
router.get('/templates', authenticateToken, async (req, res) => {
  try {
    const { category, type } = req.query;

    console.log(`📋 Getting document templates`);

    const templates = await req.integrations.foxit.getTemplates({
      category: category,
      type: type
    });

    return res.status(200).json({
      templates: templates,
      totalTemplates: templates.length,
      categories: [...new Set(templates.map(t => t.category))],
      message: 'Templates retrieved successfully'
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Create document template
router.post('/templates', authenticateToken, async (req, res) => {
  try {
    const { name, content, category, metadata = {} } = req.body;

    if (!name || !content || !category) {
      return res.status(400).json({
        error: 'Name, content, and category are required'
      });
    }

    console.log(`📝 Creating document template: ${name}`);

    const template = await req.integrations.foxit.createTemplate({
      name: name,
      content: content,
      category: category,
      metadata: metadata
    });

    return res.status(201).json({
      template: template,
      templateId: template.id,
      message: 'Template created successfully'
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Update document template
router.put('/templates/:templateId', authenticateToken, async (req, res) => {
  try {
    const { templateId } = req.params;
    const { name, content, category, metadata = {} } = req.body;

    if (!templateId) {
      return res.status(400).json({
        error: 'Template ID is required'
      });
    }

    console.log(`📝 Updating document template: ${templateId}`);

    const template = await req.integrations.foxit.updateTemplate(templateId, {
      name: name,
      content: content,
      category: category,
      metadata: metadata
    });

    return res.status(200).json({
      template: template,
      templateId: templateId,
      message: 'Template updated successfully'
    });

  } catch (error) {
    console.error('Update template error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get document analytics
router.get('/analytics', authenticateToken, async (req, res) => {
  try {
    const { timeRange = '30d' } = req.query;

    console.log(`📊 Getting document analytics for time range: ${timeRange}`);

    const analytics = await req.integrations.foxit.getDocumentAnalytics({
      timeRange: timeRange
    });

    return res.status(200).json({
      analytics: analytics,
      timeRange: timeRange,
      totalDocuments: analytics.totalDocuments || 0,
      averageGenerationTime: analytics.averageGenerationTime || 0,
      popularTemplates: analytics.popularTemplates || [],
      message: 'Document analytics retrieved successfully'
    });

  } catch (error) {
    console.error('Get document analytics error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get workflow history
router.get('/workflow-history', authenticateToken, async (req, res) => {
  try {
    const { documentId, limit = 50 } = req.query;

    console.log(`📋 Getting workflow history`);

    const history = await req.integrations.foxit.getWorkflowHistory({
      documentId: documentId,
      limit: parseInt(limit)
    });

    return res.status(200).json({
      history: history,
      totalWorkflows: history.length,
      documentId: documentId,
      message: 'Workflow history retrieved successfully'
    });

  } catch (error) {
    console.error('Get workflow history error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Retry failed operation
router.post('/retry', authenticateToken, async (req, res) => {
  try {
    const { operationId, operationType } = req.body;

    if (!operationId || !operationType) {
      return res.status(400).json({
        error: 'Operation ID and type are required'
      });
    }

    console.log(`🔄 Retrying operation: ${operationType} with ID: ${operationId}`);

    const result = await req.integrations.foxit.retryOperation(operationId, operationType);

    return res.status(200).json({
      operationId: operationId,
      operationType: operationType,
      result: result,
      status: result.status,
      message: 'Operation retried successfully'
    });

  } catch (error) {
    console.error('Retry operation error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Document health check
router.get('/health', authenticateToken, async (req, res) => {
  try {
    console.log(`🏥 Checking document service health`);

    const healthStatus = await req.integrations.foxit.healthCheck();

    return res.status(200).json({
      status: healthStatus.status,
      services: healthStatus.services,
      timestamp: new Date().toISOString(),
      message: 'Document service health check completed'
    });

  } catch (error) {
    console.error('Document health check error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Cleanup old documents
router.post('/cleanup', authenticateToken, async (req, res) => {
  try {
    const { olderThan = '30d', documentTypes = [] } = req.body;

    console.log(`🧹 Cleaning up old documents older than: ${olderThan}`);

    const cleanupResult = await req.integrations.foxit.cleanup({
      olderThan: olderThan,
      documentTypes: documentTypes
    });

    return res.status(200).json({
      cleanupResult: cleanupResult,
      documentsRemoved: cleanupResult.documentsRemoved || 0,
      spaceFreed: cleanupResult.spaceFreed || 0,
      message: 'Document cleanup completed successfully'
    });

  } catch (error) {
    console.error('Document cleanup error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Get document by ID
router.get('/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        error: 'Document ID is required'
      });
    }

    console.log(`📄 Getting document: ${documentId}`);

    // In a real implementation, this would fetch from Foxit API
    const document = {
      id: documentId,
      name: 'Sample Document',
      type: 'pdf',
      size: 1024000,
      createdAt: new Date().toISOString(),
      downloadUrl: `https://api.foxit.com/documents/${documentId}/download`,
      metadata: {
        author: req.user.email,
        template: 'welcome_packet',
        version: '1.0'
      }
    };

    return res.status(200).json({
      document: document,
      message: 'Document retrieved successfully'
    });

  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

// Delete document
router.delete('/:documentId', authenticateToken, async (req, res) => {
  try {
    const { documentId } = req.params;

    if (!documentId) {
      return res.status(400).json({
        error: 'Document ID is required'
      });
    }

    console.log(`🗑️ Deleting document: ${documentId}`);

    // In a real implementation, this would call Foxit API to delete
    const deleteResult = {
      documentId: documentId,
      deleted: true,
      timestamp: new Date().toISOString()
    };

    return res.status(200).json({
      deleteResult: deleteResult,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
});

module.exports = router;
