/**
 * Document Summarizer Component
 *
 * Allows users to upload legal documents and receive AI-powered summaries.
 *
 * PRIVACY FEATURES:
 * - Documents are never stored on our servers
 * - Summaries are session-based only
 * - Clear disclosure before document upload
 * - Download option for summaries
 */

import { useState, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Upload,
  FileText,
  Download,
  AlertTriangle,
  Shield,
  Loader2,
  CheckCircle,
  XCircle,
  Calendar,
  BookOpen,
  AlertCircle,
  ListChecks,
  Clock,
  Info,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DocumentSummary {
  summary: string;
  keyPoints: string[];
  importantDates: Array<{
    date: string;
    description: string;
    isDeadline: boolean;
  }>;
  legalTermsExplained: Array<{
    term: string;
    explanation: string;
  }>;
  potentialConcerns: string[];
  recommendedActions: string[];
  documentType: string;
  pageCount?: number;
  usageMetrics: {
    inputTokens: number;
    outputTokens: number;
    estimatedCost: number;
  };
}

interface DocumentSummarizerProps {
  /** Whether this is being used in the attorney tools section */
  isAttorneyMode?: boolean;
  /** Callback when user wants to close/cancel */
  onClose?: () => void;
}

type Step = 'disclosure' | 'upload' | 'processing' | 'result';

const SUPPORTED_TYPES = [
  { ext: 'PDF', mime: 'application/pdf', maxSize: '10MB' },
  { ext: 'DOCX', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', maxSize: '10MB' },
  { ext: 'TXT', mime: 'text/plain', maxSize: '1MB' },
  { ext: 'PNG', mime: 'image/png', maxSize: '5MB' },
  { ext: 'JPEG', mime: 'image/jpeg', maxSize: '5MB' },
];

const DOCUMENT_TYPES = [
  { value: 'general', label: 'General Legal Document' },
  { value: 'court_filing', label: 'Court Filing/Motion' },
  { value: 'police_report', label: 'Police Report' },
  { value: 'legal_document', label: 'Contract/Agreement' },
  { value: 'evidence', label: 'Evidence Document' },
];

export function DocumentSummarizer({ isAttorneyMode = false, onClose }: DocumentSummarizerProps) {
  const { t, i18n } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>(isAttorneyMode ? 'upload' : 'disclosure');
  const [consentGiven, setConsentGiven] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);

  const [summary, setSummary] = useState<DocumentSummary | null>(null);

  const handleConsentContinue = () => {
    setStep('upload');
  };

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const isSupported = SUPPORTED_TYPES.some(t => t.mime === file.type);
      if (!isSupported) {
        setError(`Unsupported file type. Please upload: ${SUPPORTED_TYPES.map(t => t.ext).join(', ')}`);
        return;
      }

      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setError('File is too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    dragCounter.current = 0;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const isSupported = SUPPORTED_TYPES.some(t => t.mime === file.type);
      if (!isSupported) {
        setError(`Unsupported file type. Please upload: ${SUPPORTED_TYPES.map(t => t.ext).join(', ')}`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File is too large. Maximum size is 10MB.');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Ensure dragging state stays true while hovering
    if (!isDragging) {
      setIsDragging(true);
    }
  }, [isDragging]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setStep('processing');
    setError(null);

    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('consentGiven', 'true');
      formData.append('language', i18n.language === 'es' ? 'es' : 'en');
      formData.append('summaryType', documentType);

      const endpoint = isAttorneyMode
        ? '/api/attorney/document-summary/summarize'
        : '/api/document-summary/summarize';

      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to summarize document');
      }

      setSummary(data.summary);
      setStep('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setStep('upload');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadSummary = () => {
    if (!summary) return;

    const content = generateSummaryText(summary);
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `document-summary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setSummary(null);
    setError(null);
    setStep(isAttorneyMode ? 'upload' : 'disclosure');
    setConsentGiven(false);
    setIsDragging(false);
    dragCounter.current = 0;
  };

  const generateSummaryText = (s: DocumentSummary): string => {
    let text = `DOCUMENT SUMMARY\n`;
    text += `Generated: ${new Date().toLocaleString()}\n`;
    text += `Document Type: ${s.documentType}\n`;
    if (s.pageCount) text += `Pages: ${s.pageCount}\n`;
    text += `\n${'='.repeat(50)}\n\n`;

    text += `SUMMARY\n${'-'.repeat(30)}\n${s.summary}\n\n`;

    if (s.keyPoints.length > 0) {
      text += `KEY POINTS\n${'-'.repeat(30)}\n`;
      s.keyPoints.forEach((p, i) => text += `${i + 1}. ${p}\n`);
      text += '\n';
    }

    if (s.importantDates.length > 0) {
      text += `IMPORTANT DATES\n${'-'.repeat(30)}\n`;
      s.importantDates.forEach(d => {
        text += `${d.isDeadline ? '[DEADLINE] ' : ''}${d.date}: ${d.description}\n`;
      });
      text += '\n';
    }

    if (s.legalTermsExplained.length > 0) {
      text += `LEGAL TERMS EXPLAINED\n${'-'.repeat(30)}\n`;
      s.legalTermsExplained.forEach(term => {
        text += `${term.term}: ${term.explanation}\n\n`;
      });
    }

    if (s.potentialConcerns.length > 0) {
      text += `POTENTIAL CONCERNS\n${'-'.repeat(30)}\n`;
      s.potentialConcerns.forEach((c, i) => text += `${i + 1}. ${c}\n`);
      text += '\n';
    }

    if (s.recommendedActions.length > 0) {
      text += `RECOMMENDED ACTIONS\n${'-'.repeat(30)}\n`;
      s.recommendedActions.forEach((a, i) => text += `${i + 1}. ${a}\n`);
      text += '\n';
    }

    text += `\n${'='.repeat(50)}\n`;
    text += `DISCLAIMER: This summary was generated by AI and is for informational purposes only.\n`;
    text += `It does not constitute legal advice. Please consult with an attorney for legal guidance.\n`;
    text += `\nGenerated by Public Defender AI - publicdefenderai.org\n`;

    return text;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <CardTitle>Document Summarizer</CardTitle>
              <CardDescription>
                Get an AI-powered plain-English summary of legal documents
              </CardDescription>
            </div>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <AnimatePresence mode="wait">
          {/* Disclosure Step */}
          {step === 'disclosure' && (
            <motion.div
              key="disclosure"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription className="space-y-3 mt-2">
                  <p>
                    <strong>Before you upload a document, please understand:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-sm">
                    <li>
                      <strong>We do not store your document</strong> - It is processed in memory and immediately discarded after generating your summary.
                    </li>
                    <li>
                      <strong>We do not store the summary</strong> - It exists only in your browser session. Download it if you want to keep it.
                    </li>
                    <li>
                      <strong>AI Processing:</strong> Your document will be analyzed by Claude, an AI assistant made by Anthropic.
                    </li>
                    <li>
                      <strong>Anthropic does not store your document permanently or use it for AI training.</strong> For operational and safety purposes, data may be temporarily retained for up to 30 days before automatic deletion.
                    </li>
                    <li>
                      <strong>Court proceedings:</strong> If you are involved in a legal case, you might be asked in court about resources you used to understand legal documents, including this resource.
                    </li>
                    <li>
                      <strong>Not legal advice:</strong> This tool provides informational summaries only, not legal advice. The AI may make mistakes or miss important details. Always have an attorney review important legal documents.
                    </li>
                  </ul>
                </AlertDescription>
              </Alert>

              <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                <Checkbox
                  id="consent"
                  checked={consentGiven}
                  onCheckedChange={(checked) => setConsentGiven(checked === true)}
                />
                <Label htmlFor="consent" className="text-sm leading-relaxed cursor-pointer">
                  I understand and agree to the information above. I understand this tool provides
                  informational summaries only, not legal advice, and I should consult with an attorney
                  for legal guidance.
                </Label>
              </div>

              <Button
                onClick={handleConsentContinue}
                disabled={!consentGiven}
                className="w-full"
              >
                Continue to Upload Document
              </Button>
            </motion.div>
          )}

          {/* Upload Step */}
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {error && (
                <Alert variant="destructive">
                  <XCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* File Drop Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                className={`
                  border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  transition-all duration-200
                  ${selectedFile
                    ? 'border-green-500 bg-green-50'
                    : isDragging
                      ? 'border-blue-500 bg-blue-100 scale-[1.02] shadow-lg'
                      : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                  }
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg,.webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedFile ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
                    <p className="font-medium text-green-700">{selectedFile.name}</p>
                    <p className="text-sm text-green-600">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedFile(null);
                      }}
                    >
                      Choose Different File
                    </Button>
                  </div>
                ) : isDragging ? (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-blue-500 mx-auto animate-bounce" />
                    <div>
                      <p className="font-medium text-blue-600">Drop your file here</p>
                      <p className="text-sm text-blue-500 mt-1">
                        Release to upload
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                    <div>
                      <p className="font-medium">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        PDF, DOCX, TXT, or images (PNG, JPEG) up to 10MB
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Document Type Selection */}
              <div className="space-y-2">
                <Label>Document Type (helps improve summary accuracy)</Label>
                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOCUMENT_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Supported formats info */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground">Supported:</span>
                {SUPPORTED_TYPES.map(type => (
                  <Badge key={type.ext} variant="secondary" className="text-xs">
                    {type.ext}
                  </Badge>
                ))}
              </div>

              <div className="flex gap-3">
                {!isAttorneyMode && (
                  <Button variant="outline" onClick={handleReset} className="flex-1">
                    Back
                  </Button>
                )}
                <Button
                  onClick={handleSubmit}
                  disabled={!selectedFile}
                  className="flex-1"
                >
                  Summarize Document
                </Button>
              </div>
            </motion.div>
          )}

          {/* Processing Step */}
          {step === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-12 text-center space-y-4"
            >
              <Loader2 className="h-12 w-12 text-blue-600 mx-auto animate-spin" />
              <div>
                <p className="font-medium text-lg">Analyzing your document...</p>
                <p className="text-sm text-muted-foreground mt-1">
                  This may take up to a minute for larger documents
                </p>
              </div>
              <div className="max-w-xs mx-auto">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '60%' }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Result Step */}
          {step === 'result' && summary && (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Document Info Header */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Summary Generated</p>
                    <p className="text-sm text-green-600">
                      {summary.documentType}
                      {summary.pageCount && ` - ${summary.pageCount} page${summary.pageCount > 1 ? 's' : ''}`}
                    </p>
                  </div>
                </div>
                <Button onClick={handleDownloadSummary} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Summary Section */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Summary
                </h3>
                <p className="text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                  {summary.summary}
                </p>
              </div>

              <Separator />

              {/* Key Points */}
              {summary.keyPoints.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Key Points
                  </h3>
                  <ul className="space-y-2">
                    {summary.keyPoints.map((point, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Important Dates */}
              {summary.importantDates.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Important Dates
                    </h3>
                    <div className="space-y-2">
                      {summary.importantDates.map((date, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg text-sm ${
                            date.isDeadline
                              ? 'bg-red-50 border border-red-200'
                              : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {date.isDeadline && (
                              <Badge variant="destructive" className="text-xs">
                                DEADLINE
                              </Badge>
                            )}
                            <span className="font-medium">{date.date}</span>
                          </div>
                          <p className="mt-1 text-muted-foreground">{date.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Legal Terms Explained */}
              {summary.legalTermsExplained.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Legal Terms Explained
                    </h3>
                    <div className="grid gap-3">
                      {summary.legalTermsExplained.map((term, i) => (
                        <div key={i} className="p-3 bg-blue-50 rounded-lg text-sm">
                          <p className="font-medium text-blue-900">{term.term}</p>
                          <p className="mt-1 text-blue-800">{term.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Potential Concerns */}
              {summary.potentialConcerns.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2 text-amber-700">
                      <AlertCircle className="h-4 w-4" />
                      Potential Concerns
                    </h3>
                    <ul className="space-y-2">
                      {summary.potentialConcerns.map((concern, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm bg-amber-50 p-3 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <span>{concern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Recommended Actions */}
              {summary.recommendedActions.length > 0 && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      Suggested Next Steps
                    </h3>
                    <ul className="space-y-2">
                      {summary.recommendedActions.map((action, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {/* Disclaimer */}
              <Alert className="mt-6">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Disclaimer</AlertTitle>
                <AlertDescription className="text-sm">
                  This summary was generated by AI and is for informational purposes only.
                  It does not constitute legal advice. The AI may have made errors or missed
                  important details. Please consult with an attorney for legal guidance.
                </AlertDescription>
              </Alert>

              {/* Privacy Confirmation */}
              <div className="p-4 bg-gray-50 rounded-lg text-sm text-muted-foreground">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Privacy Confirmation</span>
                </div>
                <p>
                  Your document and this summary have not been stored on our servers.
                  This data exists only in your browser session. Download the summary
                  if you want to keep it.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleDownloadSummary} variant="outline" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Download Summary
                </Button>
                <Button onClick={handleReset} className="flex-1">
                  Summarize Another Document
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

    </Card>
  );
}

export default DocumentSummarizer;
