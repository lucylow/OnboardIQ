const User = require('../models/User');
const FoxitService = require('../services/foxitService');

const documentController = {
  // Generate a custom document for a user
  async generateCustomDocument(req, res) {
    try {
      const { userId, templateId, data } = req.body;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const document = await FoxitService.generateDocument(templateId, data);

      // Save document reference to user
      await User.findByIdAndUpdate(userId, {
        $push: {
          documents: {
            type: 'custom',
            foxitDocumentId: document.document_id,
            downloadUrl: document.download_url
          }
        }
      });

      res.status(200).json({
        message: 'Document generated successfully',
        document: {
          id: document.document_id,
          downloadUrl: document.download_url
        }
      });
    } catch (error) {
      console.error('Document generation error:', error);
      res.status(500).json({ error: 'Failed to generate document' });
    }
  },

  // Get all documents for a user
  async getUserDocuments(req, res) {
    try {
      const { userId } = req.params;

      const user = await User.findById(userId).select('documents');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.status(200).json({
        documents: user.documents
      });
    } catch (error) {
      console.error('Get documents error:', error);
      res.status(500).json({ error: 'Failed to retrieve documents' });
    }
  }
};

module.exports = documentController;
