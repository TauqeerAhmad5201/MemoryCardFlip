# Memory Card Flip Game - Copilot Instructions

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a full-stack memory card flip game built with:
- **Frontend**: Next.js 15 with TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Nest.js with TypeScript, TypeORM, SQLite

## Architecture Guidelines
- Use modern React patterns with hooks and functional components
- Implement proper TypeScript types for all components and APIs
- Follow responsive design principles with Tailwind CSS
- Use Framer Motion for smooth animations and transitions
- Implement proper error handling and loading states

## Code Style Preferences
- Use Arrow functions for components and utilities
- Prefer const over let when possible
- Use proper TypeScript interfaces for all data structures
- Follow REST API conventions for backend endpoints
- Implement proper validation using class-validator on backend

## Game Logic
- Cards should flip with smooth animations
- Implement difficulty levels: Easy (4x4), Medium (6x6), Hard (8x8)
- Time-based scoring system with bonus points for speed
- Store user progress and high scores in the database
- Prevent rapid clicking and cheating mechanisms

## Performance Considerations
- Optimize card animations for 60fps
- Use proper memoization for expensive calculations
- Implement efficient game state management
- Minimize API calls and use caching where appropriate
