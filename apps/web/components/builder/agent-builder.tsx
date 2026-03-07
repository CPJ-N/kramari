'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useBuilderStore, BUILDER_STEPS, type BuilderStep } from './builder-store'
import { StartStep } from './steps/start-step'
import { IdentityStep } from './steps/identity-step'
import { VoiceStep } from './steps/voice-step'
import { BehaviorStep } from './steps/behavior-step'
import { ToolsStep } from './steps/tools-step'
import { KnowledgeStep } from './steps/knowledge-step'
import { ReviewStep } from './steps/review-step'

const STEP_COMPONENTS: Record<BuilderStep, React.ComponentType> = {
  start: StartStep,
  identity: IdentityStep,
  voice: VoiceStep,
  behavior: BehaviorStep,
  tools: ToolsStep,
  knowledge: KnowledgeStep,
  review: ReviewStep,
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -300 : 300,
    opacity: 0,
  }),
}

export function AgentBuilder() {
  const { currentStep, direction, nextStep, prevStep, setStep, resetBuilder } = useBuilderStore()
  const currentIndex = BUILDER_STEPS.findIndex(s => s.id === currentStep)
  const StepComponent = STEP_COMPONENTS[currentStep]

  useEffect(() => {
    return () => {
      // Don't reset on unmount — user might navigate back
    }
  }, [])

  return (
    <div className="min-h-screen bg-kramari-cream/50 dark:bg-kramari-dark">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-kramari-dark/80 backdrop-blur-sm border-b border-kramari-taupe/10 dark:border-kramari-charcoal/20">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-sm font-medium text-kramari-charcoal dark:text-kramari-taupe">
              Agent Builder
            </h1>
            <span className="text-xs text-kramari-muted">
              Step {currentIndex + 1} of {BUILDER_STEPS.length}
            </span>
          </div>

          {/* Step Dots */}
          <div className="flex items-center gap-1">
            {BUILDER_STEPS.map((step, i) => (
              <button
                key={step.id}
                onClick={() => setStep(step.id)}
                className="flex-1 group relative"
              >
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i < currentIndex
                      ? 'bg-kramari-charcoal dark:bg-kramari-taupe'
                      : i === currentIndex
                        ? 'bg-gradient-to-r from-kramari-charcoal to-kramari-muted'
                        : 'bg-kramari-taupe/20 dark:bg-kramari-charcoal/30'
                  }`}
                />
                <span className={`absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap transition-opacity ${
                  i === currentIndex
                    ? 'opacity-100 text-kramari-charcoal dark:text-kramari-taupe font-medium'
                    : 'opacity-0 group-hover:opacity-100 text-kramari-muted'
                }`}>
                  {step.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Footer */}
      {currentStep !== 'start' && (
        <div className="sticky bottom-0 bg-white/80 dark:bg-kramari-dark/80 backdrop-blur-sm border-t border-kramari-taupe/10 dark:border-kramari-charcoal/20">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back
            </Button>

            {currentStep !== 'review' && (
              <Button onClick={nextStep}>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
