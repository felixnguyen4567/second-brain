---
title: "ElevenLabs CLI"
type: entity
category: cli-tool / voice-ai
tags: [cli-tools, TTS, STT, voice-cloning, audio, ai-agents]
related_sources: [10-must-have-clis-ai-agents-2026]
related_concepts: [CLI-Tools]
created: 2026-05-04
---

# ElevenLabs CLI

Command-line interface for ElevenLabs text-to-speech, speech-to-text, and voice cloning. Enables audio generation and transcription directly from the terminal with JSON output for scripting.

## Overview

**The problem it solves**: Adding voice to an app means writing wrapper code, handling audio formats, managing API responses, and figuring out file output every single time.

**What it does**: One terminal command for TTS, STT, voice cloning, and sound effects. `--json` flag makes every command scriptable and CI-ready.

## Key Commands

```bash
# Generate audio from text
elevenlabs-cli tts "Ship high-quality audio from the terminal" \
  --voice Brian --output narration.mp3

# Transcribe with speaker labels
elevenlabs-cli stt meeting.mp3 --diarize --num-speakers 3

# Clone a voice from samples
elevenlabs-cli voice clone --name "My Voice" --samples clip1.mp3,clip2.mp3
```

## Use Cases

- Automated narration generation
- Meeting transcription with speaker diarization
- Voice interface prototyping
- CI pipeline audio output

## Related Concepts

- [[concepts/CLI-Tools]]
