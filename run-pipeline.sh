#!/bin/bash
# run-pipeline.sh - Local Content Pipeline v3.0 Runner helper

# Navigate to the second-brain directory
cd "$(dirname "$0")"

# Execute the local content engine script passing all arguments
node scripts/generate-local.js "$@"
