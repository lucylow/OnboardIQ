// Document Generation Service - Real Implementation
import { foxitApiService } from './foxitApiService';

export interface DocumentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  variables: string[];
  sections: string[];
  format: string;
  estimatedTime: number;
}

export interface GeneratedDocument {
  id: string;
  userId: string;
  templateId: string;
  status: 'generating' | 'completed' | 'failed' | 'archived';
  createdAt: Date;
  completedAt?: Date;
  fileUrl?: string;
  fileSize?: number;
  downloadCount: number;
  variables: Record<string, string>;
  personalization: {
    industry_specific: boolean;
    company_branding: boolean;
    custom_content: boolean;
  };
  quality: {
    score: number;
    issues?: string[];
  };
}

export interface DocumentAnalytics {
  totalGenerated: number;
  successful: number;
  failed: number;
  successRate: number;
  averageGenerationTime: number;
  totalFileSize: number;
  byTemplate: Record<string, { generated: number; success: number; avgTime: number }>;
  byIndustry: Record<string, { generated: number; success: number }>;
}

class DocumentGenerationService {
  private documents: Map<string, GeneratedDocument> = new Map();
  private analytics: DocumentAnalytics = {
    totalGenerated: 0,
    successful: 0,
    failed: 0,
    successRate: 0,
    averageGenerationTime: 0,
    totalFileSize: 0,
    byTemplate: {},
    byIndustry: {}
  };

  private templates: DocumentTemplate[] = [
    {
      id: 'welcome_packet',
      name: 'Welcome Packet',
      category: 'onboarding',
      description: 'Comprehensive welcome package with platform overview and getting started guide',
      variables: ['user_name', 'company_name', 'plan_tier', 'onboarding_date'],
      sections: [
        'Welcome Letter',
        'Platform Overview',
        'Getting Started Guide',
        'Contact Information',
        'Next Steps'
      ],
      format: 'pdf',
      estimatedTime: 2.5
    },
    {
      id: 'service_agreement',
      name: 'Service Agreement',
      category: 'legal',
      description: 'Standard service agreement with customizable terms',
      variables: ['company_name', 'contact_name', 'start_date', 'plan_details'],
      sections: [
        'Terms of Service',
        'Service Description',
        'Payment Terms',
        'Data Protection',
        'Termination Clause'
      ],
      format: 'pdf',
      estimatedTime: 3.0
    },
    {
      id: 'user_guide',
      name: 'User Guide',
      category: 'training',
      description: 'Comprehensive user guide with screenshots and step-by-step instructions',
      variables: ['user_name', 'company_name', 'industry', 'use_case'],
      sections: [
        'Getting Started',
        'Core Features',
        'Advanced Features',
        'Troubleshooting',
        'Support Resources'
      ],
      format: 'pdf',
      estimatedTime: 4.0
    },
    {
      id: 'onboarding_checklist',
      name: 'Onboarding Checklist',
      category: 'onboarding',
      description: 'Customizable checklist for onboarding process',
      variables: ['user_name', 'company_name', 'onboarding_steps'],
      sections: [
        'Account Setup',
        'Profile Configuration',
        'Document Review',
        'Security Verification',
        'Final Steps'
      ],
      format: 'pdf',
      estimatedTime: 1.5
    }
  ];

  // Generate a document
  async generateDocument(
    userId: string,
    templateId: string,
    variables: Record<string, string>,
    personalization: {
      industry_specific: boolean;
      company_branding: boolean;
      custom_content: boolean;
    } = {
      industry_specific: false,
      company_branding: false,
      custom_content: false
    }
  ): Promise<GeneratedDocument> {
    try {
      const template = this.templates.find(t => t.id === templateId);
      if (!template) {
        throw new Error(`Template ${templateId} not found`);
      }

      const documentId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create document record
      const document: GeneratedDocument = {
        id: documentId,
        userId,
        templateId,
        status: 'generating',
        createdAt: new Date(),
        downloadCount: 0,
        variables,
        personalization,
        quality: {
          score: 0.9 // Default quality score
        }
      };

      this.documents.set(document.id, document);
      this.analytics.totalGenerated++;
      this.updateAnalytics();

      // Generate document via Foxit API
      const foxitResponse = await foxitApiService.generateDocument({
        templateId: templateId,
        data: {
          ...variables,
          personalization,
          sections: template.sections,
          format: template.format
        }
      });

      if (foxitResponse.success) {
        document.status = 'completed';
        document.completedAt = new Date();
        document.fileUrl = foxitResponse.document_url || '';
        document.fileSize = parseInt(foxitResponse.file_size?.replace(/[^\d.]/g, '') || '0') || 0;
        document.quality.score = 0.9; // Default quality score

        this.analytics.successful++;
        this.updateAnalytics();

        return document;
      } else {
        document.status = 'failed';
        this.analytics.failed++;
        this.updateAnalytics();
        throw new Error(foxitResponse.error || 'Document generation failed');
      }
    } catch (error) {
      console.error('Document Generation Error:', error);
      throw error;
    }
  }

  // Get document by ID
  getDocument(documentId: string): GeneratedDocument | undefined {
    return this.documents.get(documentId);
  }

  // Get documents by user ID
  getDocumentsByUserId(userId: string): GeneratedDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.userId === userId);
  }

  // Get documents by template
  getDocumentsByTemplate(templateId: string): GeneratedDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.templateId === templateId);
  }

  // Get documents by status
  getDocumentsByStatus(status: GeneratedDocument['status']): GeneratedDocument[] {
    return Array.from(this.documents.values()).filter(doc => doc.status === status);
  }

  // Get templates by category
  getTemplatesByCategory(category: string): DocumentTemplate[] {
    return this.templates.filter(template => template.category === category);
  }

  // Get all templates
  getAllTemplates(): DocumentTemplate[] {
    return this.templates;
  }

  // Get template by ID
  getTemplate(templateId: string): DocumentTemplate | undefined {
    return this.templates.find(template => template.id === templateId);
  }

  // Get analytics
  getAnalytics(): DocumentAnalytics {
    return { ...this.analytics };
  }

  // Update analytics
  private updateAnalytics(): void {
    const documents = Array.from(this.documents.values());
    
    if (this.analytics.totalGenerated > 0) {
      this.analytics.successRate = this.analytics.successful / this.analytics.totalGenerated;
    }

    const completedDocs = documents.filter(d => d.status === 'completed' && d.completedAt && d.createdAt);
    if (completedDocs.length > 0) {
      this.analytics.averageGenerationTime = completedDocs.reduce((sum, doc) => {
        return sum + (doc.completedAt!.getTime() - doc.createdAt.getTime()) / (1000 * 60); // Convert to minutes
      }, 0) / completedDocs.length;
    }

    this.analytics.totalFileSize = documents
      .filter(d => d.status === 'completed' && d.fileSize)
      .reduce((sum, doc) => sum + (doc.fileSize || 0), 0);

    // Update by template analytics
    this.analytics.byTemplate = {};
    this.templates.forEach(template => {
      const templateDocs = this.getDocumentsByTemplate(template.id);
      this.analytics.byTemplate[template.id] = {
        generated: templateDocs.length,
        success: templateDocs.filter(d => d.status === 'completed').length,
        avgTime: template.estimatedTime
      };
    });
  }

  // Download document
  async downloadDocument(documentId: string): Promise<{ url: string; filename: string; isBlob: boolean }> {
    const document = this.documents.get(documentId);
    
    if (!document || document.status !== 'completed') {
      throw new Error('Document not available for download');
    }

    // Increment download count
    document.downloadCount++;
    
    // Generate filename
    const template = this.getTemplate(document.templateId);
    const filename = `${template?.name || 'Document'}_${documentId}.pdf`;

    // If we have a fileUrl, use it directly
    if (document.fileUrl) {
      return {
        url: document.fileUrl,
        filename,
        isBlob: false
      };
    }

    // Otherwise, create a mock PDF download
    const mockPdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj  
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
4 0 obj
<< /Length 300 >>
stream
BT
/F1 12 Tf
50 700 Td
(OnboardIQ Document) Tj
0 -20 Td
(Template: ${template?.name || 'Unknown'}) Tj  
0 -20 Td
(Document ID: ${documentId}) Tj
0 -20 Td
(Generated: ${document.createdAt.toLocaleString()}) Tj
0 -40 Td
(This is a demo document generated by OnboardIQ) Tj
0 -20 Td
(Status: ${document.status}) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000265 00000 n 
0000000600 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
700
%%EOF`;

    const blob = new Blob([mockPdfContent], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    
    return {
      url: url,
      filename,
      isBlob: true
    };
  }

  // Archive document
  async archiveDocument(documentId: string): Promise<GeneratedDocument> {
    const document = this.documents.get(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    document.status = 'archived';
    return document;
  }

  // Get document statistics
  getDocumentStats(): { total: number; generating: number; completed: number; failed: number; archived: number } {
    const documents = Array.from(this.documents.values());
    return {
      total: documents.length,
      generating: documents.filter(d => d.status === 'generating').length,
      completed: documents.filter(d => d.status === 'completed').length,
      failed: documents.filter(d => d.status === 'failed').length,
      archived: documents.filter(d => d.status === 'archived').length
    };
  }

  // Get personalization statistics
  getPersonalizationStats(): { industrySpecific: number; companyBranding: number; customContent: number } {
    const documents = Array.from(this.documents.values());
    return {
      industrySpecific: documents.filter(d => d.personalization.industry_specific).length,
      companyBranding: documents.filter(d => d.personalization.company_branding).length,
      customContent: documents.filter(d => d.personalization.custom_content).length
    };
  }

  // Validate template variables
  validateTemplateVariables(templateId: string, variables: Record<string, string>): { valid: boolean; missing: string[] } {
    const template = this.getTemplate(templateId);
    if (!template) {
      return { valid: false, missing: [] };
    }

    const missing = template.variables.filter(variable => !variables[variable]);
    return {
      valid: missing.length === 0,
      missing
    };
  }

  // Get document quality metrics
  getQualityMetrics(): { averageScore: number; highQuality: number; lowQuality: number } {
    const documents = Array.from(this.documents.values()).filter(d => d.status === 'completed');
    
    if (documents.length === 0) {
      return { averageScore: 0, highQuality: 0, lowQuality: 0 };
    }

    const scores = documents.map(d => d.quality.score);
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const highQuality = documents.filter(d => d.quality.score >= 0.9).length;
    const lowQuality = documents.filter(d => d.quality.score < 0.7).length;

    return { averageScore, highQuality, lowQuality };
  }

  // Create custom template
  async createCustomTemplate(template: Omit<DocumentTemplate, 'id'>): Promise<DocumentTemplate> {
    const newTemplate: DocumentTemplate = {
      ...template,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    this.templates.push(newTemplate);
    return newTemplate;
  }

  // Update document quality
  async updateDocumentQuality(documentId: string, quality: { score: number; issues?: string[] }): Promise<GeneratedDocument> {
    const document = this.documents.get(documentId);
    
    if (!document) {
      throw new Error('Document not found');
    }

    document.quality = quality;
    return document;
  }
}

// Export singleton instance
export const documentGenerationService = new DocumentGenerationService();
export default documentGenerationService;
