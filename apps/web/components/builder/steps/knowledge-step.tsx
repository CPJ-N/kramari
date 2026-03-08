'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, FileText, HelpCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBuilderStore, type KnowledgeEntry } from '../builder-store'

export function KnowledgeStep() {
  const { config, addKnowledgeEntry, removeKnowledgeEntry, updateKnowledgeEntry } = useBuilderStore()
  const [addMode, setAddMode] = useState<'faq' | 'document' | null>(null)
  const [newQuestion, setNewQuestion] = useState('')
  const [newAnswer, setNewAnswer] = useState('')
  const [newDocName, setNewDocName] = useState('')
  const [newDocContent, setNewDocContent] = useState('')

  const handleAddFaq = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) return
    addKnowledgeEntry({
      id: crypto.randomUUID(),
      type: 'faq',
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
    })
    setNewQuestion('')
    setNewAnswer('')
    setAddMode(null)
  }

  const handleAddDocument = () => {
    if (!newDocContent.trim()) return
    addKnowledgeEntry({
      id: crypto.randomUUID(),
      type: 'document',
      fileName: newDocName.trim() || 'Untitled Document',
      content: newDocContent.trim(),
    })
    setNewDocName('')
    setNewDocContent('')
    setAddMode(null)
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-kramari-charcoal dark:text-kramari-taupe">
          Knowledge Base
        </h2>
        <p className="text-kramari-muted mt-1">
          Add information your agent can reference during calls
        </p>
      </div>

      {/* Existing Entries */}
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {config.knowledgeBase.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-start gap-3 p-3 rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 bg-white dark:bg-kramari-dark/50"
            >
              <div className={`shrink-0 p-1.5 rounded-lg ${
                entry.type === 'faq'
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                  : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'
              }`}>
                {entry.type === 'faq' ? (
                  <HelpCircle className="h-4 w-4" />
                ) : (
                  <FileText className="h-4 w-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                {entry.type === 'faq' ? (
                  <>
                    <p className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
                      Q: {entry.question}
                    </p>
                    <p className="text-xs text-kramari-muted mt-0.5">
                      A: {entry.answer}
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
                      {entry.fileName}
                    </p>
                    <p className="text-xs text-kramari-muted mt-0.5 truncate">
                      {entry.content?.slice(0, 100)}...
                    </p>
                  </>
                )}
              </div>
              <button
                onClick={() => removeKnowledgeEntry(entry.id)}
                className="shrink-0 p-1 text-kramari-muted hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {config.knowledgeBase.length === 0 && !addMode && (
          <div className="text-center py-8 text-kramari-muted">
            <p className="text-sm">No knowledge entries yet</p>
            <p className="text-xs mt-1">Add FAQs or documents your agent can reference</p>
          </div>
        )}
      </div>

      {/* Add Form */}
      <AnimatePresence mode="wait">
        {addMode === 'faq' && (
          <motion.div
            key="faq-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 p-4 rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 bg-white dark:bg-kramari-dark/50"
          >
            <p className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
              Add FAQ Entry
            </p>
            <Input
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Question: e.g. What are your business hours?"
            />
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Answer: e.g. We're open Monday through Friday, 9 AM to 5 PM."
              rows={3}
              className="w-full rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/20 bg-kramari-cream dark:bg-kramari-dark px-3 py-2 text-sm text-kramari-charcoal dark:text-kramari-taupe placeholder:text-kramari-muted/60 focus:outline-none focus:ring-2 focus:ring-kramari-charcoal dark:focus:ring-kramari-taupe resize-none transition-all"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setAddMode(null)}>Cancel</Button>
              <Button size="sm" onClick={handleAddFaq} disabled={!newQuestion.trim() || !newAnswer.trim()}>
                Add FAQ
              </Button>
            </div>
          </motion.div>
        )}

        {addMode === 'document' && (
          <motion.div
            key="doc-form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3 p-4 rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/30 bg-white dark:bg-kramari-dark/50"
          >
            <p className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
              Add Document
            </p>
            <Input
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="Document name (optional)"
            />
            <textarea
              value={newDocContent}
              onChange={(e) => setNewDocContent(e.target.value)}
              placeholder="Paste your document content here... This could be product info, policies, procedures, etc."
              rows={6}
              className="w-full rounded-xl border border-kramari-taupe/20 dark:border-kramari-charcoal/20 bg-kramari-cream dark:bg-kramari-dark px-3 py-2 text-sm text-kramari-charcoal dark:text-kramari-taupe placeholder:text-kramari-muted/60 focus:outline-none focus:ring-2 focus:ring-kramari-charcoal dark:focus:ring-kramari-taupe resize-none transition-all font-mono"
            />
            <div className="flex gap-2 justify-end">
              <Button variant="ghost" size="sm" onClick={() => setAddMode(null)}>Cancel</Button>
              <Button size="sm" onClick={handleAddDocument} disabled={!newDocContent.trim()}>
                Add Document
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Buttons */}
      {!addMode && (
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => setAddMode('faq')}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Add FAQ
          </Button>
          <Button variant="outline" onClick={() => setAddMode('document')}>
            <FileText className="h-4 w-4 mr-2" />
            Add Document
          </Button>
        </div>
      )}

      <p className="text-xs text-kramari-muted text-center">
        {config.knowledgeBase.length} entr{config.knowledgeBase.length !== 1 ? 'ies' : 'y'} added
      </p>
    </div>
  )
}
