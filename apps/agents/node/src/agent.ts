// SPDX-FileCopyrightText: 2024 Kramari
// SPDX-License-Identifier: MIT

import {
  type JobContext,
  type JobProcess,
  WorkerOptions,
  cli,
  defineAgent,
  llm,
  voice,
} from '@livekit/agents';
import * as deepgram from '@livekit/agents-plugin-deepgram';
import * as elevenlabs from '@livekit/agents-plugin-elevenlabs';
import * as openai from '@livekit/agents-plugin-openai';
import * as silero from '@livekit/agents-plugin-silero';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, '../.env.local');
dotenv.config({ path: envPath });

/**
 * Kramari Voice Agent
 *
 * A voice AI agent powered by LiveKit Agents.
 * Uses: Deepgram (STT) + OpenAI (LLM) + ElevenLabs (TTS)
 */

// Default agent configuration - will be loaded from database in Phase 2
const DEFAULT_SYSTEM_PROMPT = `You are Kramari, a helpful voice assistant.
Your interface with users is voice, so keep responses short and conversational.
Be friendly, professional, and helpful. Avoid using punctuation that can't be pronounced.
If you don't know something, say so honestly.`;

// Define tools the agent can use
const tools: llm.ToolContext = {
  get_current_time: llm.tool({
    description: 'Get the current time',
    execute: async () => {
      const now = new Date();
      return `The current time is ${now.toLocaleTimeString()}.`;
    },
  }),
  get_weather: llm.tool({
    description: 'Get the weather in a location',
    parameters: z.object({
      location: z.string().describe('The location to get the weather for'),
    }),
    execute: async ({ location }) => {
      console.log(`[Kramari] Getting weather for: ${location}`);
      try {
        const response = await fetch(`https://wttr.in/${location}?format=%C+%t`);
        if (!response.ok) {
          throw new Error(`Weather API returned status: ${response.status}`);
        }
        const weather = await response.text();
        return `The weather in ${location} is ${weather}.`;
      } catch (error) {
        console.error('[Kramari] Weather fetch error:', error);
        return `Sorry, I couldn't get the weather for ${location}.`;
      }
    },
  }),
};

export default defineAgent({
  prewarm: async (proc: JobProcess) => {
    // Preload VAD model for faster startup
    proc.userData.vad = await silero.VAD.load();
    console.log('[Kramari] VAD model loaded');
  },

  entry: async (ctx: JobContext) => {
    const vad = ctx.proc.userData.vad! as silero.VAD;

    // Connect to the LiveKit room
    await ctx.connect();
    console.log(`[Kramari] Connected to room: ${ctx.room.name}`);

    // Wait for a participant to join
    const participant = await ctx.waitForParticipant();
    console.log(`[Kramari] Participant joined: ${participant.identity}`);

    // Create the AI agent with instructions and tools
    const agent = new voice.Agent({
      instructions: DEFAULT_SYSTEM_PROMPT,
      tools,
    });

    // Create the voice session with STT/LLM/TTS pipeline
    const session = new voice.AgentSession({
      stt: new deepgram.STT(),
      llm: new openai.LLM(),
      tts: new elevenlabs.TTS(),
      vad,
    });

    // Event handlers for monitoring
    session.on(voice.AgentSessionEventTypes.UserInputTranscribed, (ev) => {
      console.log(`[Kramari] User said: ${ev.transcript}`);
    });

    session.on(voice.AgentSessionEventTypes.AgentStateChanged, (ev) => {
      console.log(`[Kramari] Agent state: ${ev.newState}`);
    });

    session.on(voice.AgentSessionEventTypes.Error, (ev) => {
      console.error('[Kramari] Error:', ev.error);
    });

    // Start the voice session
    await session.start({ agent, room: ctx.room });
    console.log('[Kramari] Voice session started');

    // Greet the user
    session.say('Hello! I am Kramari, your voice assistant. How can I help you today?');
  },
});

// CLI entry point - handles dev/start commands
cli.runApp(new WorkerOptions({ agent: fileURLToPath(import.meta.url) }));
