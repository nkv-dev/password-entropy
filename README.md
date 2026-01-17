# Password Entropy Tool

A web-based password strength analyzer and generator that calculates password entropy and estimates crack times.

## Features

- **Password Analysis**: Analyze password strength using entropy calculation
- **Crack Time Estimation**: View estimated time to crack under different scenarios
- **Password Generator**: Generate secure passwords based on target entropy levels
- **Dark/Light Theme**: Toggle between dark and light modes
- **Real-time Feedback**: Get instant password strength feedback and suggestions

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the application:
   ```bash
   npm start
   ```

3. Open browser to: http://localhost:5000

## How It Works

- **Entropy**: Measures password unpredictability in bits
- **Score 0-4**: Very Weak (0-40), Weak (40-60), Moderate (60-80), Strong (80-100), Very Strong (100+)
- **Crack Times**: Shows time to crack for different attack scenarios

## API Endpoints

- `POST /api/analyze/` - Analyze password strength
- `POST /api/generate/` - Generate secure password
