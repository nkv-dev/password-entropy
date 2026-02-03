# Password Entropy Tool

A web-based password strength analyzer and generator with mobile-optimized UI, chaos bubble animations, and comprehensive entropy calculations.

## Features

- **Password Analysis**: Real-time entropy calculation with visual strength indicators
- **Password Generator**: Generate secure passwords with customizable length and character types
- **Mobile-First Design**: Optimized for mobile devices with 44×44px touch targets
- **Chaos Bubble Animation**: Dynamic animated background with mobile performance optimizations
- **Syntax Highlighting**: Color-coded password characters (numbers, letters, brackets, symbols)
- **Crack Time Estimation**: Estimated crack times for various attack scenarios (online throttled, online fast, offline slow, offline fast)
- **Glass-Morphism UI**: Modern dark theme with backdrop blur effects
- **PWA Support**: Mobile web app capabilities with theme color and safe area support

## Architecture

The project follows a modular architecture for maintainability:

### Directory Structure

```
/home/user/Coding/Entropy/
├── src/                           # Backend source code
│   ├── server.js                  # Express server configuration
│   ├── routes/
│   │   ├── analyze.js             # POST /api/analyze/ route
│   │   └── generate.js            # POST /api/generate/ route
│   └── utils/
│       ├── entropy.js             # Entropy calculation utilities
│       └── password.js            # Password generation utilities
├── public/                        # Static client assets
│   ├── css/                       # Modular stylesheets
│   │   ├── base.css               # CSS variables, reset, layout
│   │   ├── utilities.css          # Helper classes
│   │   ├── components.css         # Buttons, inputs, toggles
│   │   ├── generator-panel.css    # Password generator styles
│   │   ├── analyzer-panel.css     # Password analyzer styles
│   │   ├── collapsible.css        # Collapsible sections
│   │   └── responsive.css         # Mobile breakpoints & media queries
│   └── js/                        # Modular JavaScript
│       ├── main.js                # Entry point & canvas animation
│       ├── utils.js               # Global utilities, notifications
│       ├── ui-panels.js           # Panel visibility management
│       ├── password-generator.js  # Generator logic & presets
│       ├── password-analyzer.js   # Analysis pipeline & results display
│       └── vendor/
│           └── zxcvbn.js          # Password strength estimation library
├── views/
│   └── index.html                 # Main application template
├── package.json                   # NPM configuration
├── Dockerfile                     # Container configuration
└── README.md                      # This file
```

### Backend Modules

- **server.js**: Express server with CORS, static file serving, and route mounting
- **routes/analyze.js**: API endpoint for password entropy analysis
- **routes/generate.js**: API endpoint for secure password generation
- **utils/entropy.js**: Core entropy calculation, scoring, and crack time estimation
- **utils/password.js**: Cryptographically secure password generation using Node.js crypto

### Frontend Modules

- **main.js**: Application entry point, chaos canvas animation (mobile-optimized with frame skipping)
- **utils.js**: Password syntax highlighting, toast notifications, global state management
- **ui-panels.js**: Panel show/hide functionality, collapsible sections
- **password-generator.js**: Generator UI controls, presets, clipboard operations
- **password-analyzer.js**: Input handling, API calls, results display, crack times visualization

### CSS Modules

- **base.css**: Design system variables, canvas styles, glass-morphism panel
- **utilities.css**: Helper classes (spacing, text, display)
- **components.css**: Reusable UI components (buttons, inputs, toggles)
- **generator-panel.css**: Range sliders, preset chips, character type checkboxes
- **analyzer-panel.css**: Score circles, entropy display, crack time grid
- **collapsible.css**: Collapsible sections, entropy scale, social links
- **responsive.css**: Mobile breakpoints (375px, 575px, 767px, 991px), touch targets, safe area support

## Setup

### Prerequisites

- Node.js >= 18.0.0
- npm >= 8.0.0

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/nkv-dev/password-entropy-tool.git
   cd password-entropy-tool
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the application:
   ```bash
   npm start
   ```

4. Open browser to: http://localhost:5000

### Development Mode

```bash
npm run dev
```

## Environment Variables

Create a `.env` file in the root directory (optional):

```env
# Server Configuration
PORT=5000                          # Server port (default: 5000)
NODE_ENV=development               # Environment mode (development/production)

# CORS Settings
CORS_ORIGIN=*                      # Allowed CORS origins
```

### Variable Descriptions

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 5000 | The port number the server listens on |
| `NODE_ENV` | development | Sets application environment mode |
| `CORS_ORIGIN` | * | Configures CORS origin policy |

**Note:** The application works without a `.env` file using sensible defaults.

## Docker Deployment

Build and run with Docker:

```bash
docker build -t password-entropy .
docker run -p 5000:5000 password-entropy
```

## API Documentation

### POST /api/analyze/

Analyze a password and return entropy metrics.

**Request Body:**
```json
{
  "password": "MyP@ssw0rd!"
}
```

**Response:**
```json
{
  "entropy": 75.4,
  "score": 3,
  "password_length": 12,
  "feedback": {
    "warning": "",
    "suggestions": []
  },
  "crack_times": {
    "online_throttling": { "display": "3 days" },
    "online_no_throttling": { "display": "8 hours" },
    "offline_slow": { "display": "29 seconds" },
    "offline_fast": { "display": "instant" }
  }
}
```

### POST /api/generate/

Generate a secure password with specified options.

**Request Body:**
```json
{
  "target_entropy": 60,
  "password_length": 16,
  "use_lowercase": true,
  "use_uppercase": true,
  "use_digits": true,
  "use_symbols": true
}
```

**Response:**
```json
{
  "password": "aB3#xK9$mP2@nQ7!",
  "length": 16,
  "entropy": 103.4,
  "crack_times": {
    "online_throttling": { "display": "16 years" },
    "online_no_throttling": { "display": "2 years" },
    "offline_slow": { "display": "4 hours" },
    "offline_fast": { "display": "1 second" }
  }
}
```

### GET /health

Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2026-02-03T10:15:30.000Z",
  "uptime": 3600.123
}
```

## Password Entropy Calculation

### Entropy Formula

```
Entropy (bits) = Password Length × log2(Character Pool Size)
```

### Character Pool Sizes

- Lowercase letters (a-z): 26
- Uppercase letters (A-Z): 26
- Digits (0-9): 10
- Symbols (!@#$%^&*...): 32

### Score Scale

| Score | Entropy Range | Strength Level | Color |
|-------|--------------|----------------|-------|
| 0 | 0-40 bits | Very Weak | Red (#dc3545) |
| 1 | 40-60 bits | Weak | Orange (#fd7e14) |
| 2 | 60-80 bits | Moderate | Yellow (#ffc107) |
| 3 | 80-100 bits | Strong | Blue/Purple (#7c7cff) |
| 4 | 100+ bits | Very Strong | Green (#198754) |

### Crack Time Scenarios

- **Online Throttled**: 100 attempts/hour (typical website login)
- **Online No Throttling**: 10 attempts/second (unprotected API)
- **Offline Slow**: 10,000 attempts/second (slow hash like bcrypt)
- **Offline Fast**: 10,000,000,000 attempts/second (fast hash, GPU cluster)

## Mobile Optimization

### Features

- **Touch Targets**: Minimum 44×44px (WCAG 2.1 compliance)
- **Safe Area Support**: CSS `env(safe-area-inset-*)` for notched phones
- **Responsive Breakpoints**: 
  - Extra Small: 375px
  - Small: 575px
  - Medium: 767px
  - Large: 991px
- **Performance Optimizations**:
  - Canvas animation: Frame skipping on mobile (30fps vs 60fps)
  - Reduced bubble count: 12 bubbles on small screens (vs 25 on desktop)
  - Glass-morphism blur reduced on mobile for better performance
- **iOS Optimizations**:
  - Font size 16px+ to prevent auto-zoom on input focus
  - `-webkit-tap-highlight-color: transparent` for better touch feedback
  - `touch-action: pan-y pinch-zoom` to prevent horizontal scroll

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile Safari (iOS 14+)
- Chrome Mobile (Android 10+)

## Security Considerations

### Password Security

- **No Password Storage**: Passwords are never stored or logged server-side
- **Client-Side Analysis**: Entropy calculation can be done without sending passwords to the server (for offline analysis)
- **HTTPS Recommended**: Always use HTTPS in production to protect password transmission
- **Clipboard**: Generated passwords are copied to system clipboard - clear clipboard after use on shared computers

### Cryptographic Security

- **Random Generation**: Uses Node.js `crypto.randomInt()` for cryptographically secure random number generation
- **Character Pool**: 94 possible characters (26 lowercase + 26 uppercase + 10 digits + 32 symbols)
- **Minimum Length**: Enforces minimum 5 character length for generated passwords
- **Maximum Length**: Limited to 128 characters to prevent abuse

### API Security

- **CORS**: Configurable CORS origins (restrict in production)
- **Rate Limiting**: Not included - add rate limiting middleware for production use
- **Input Validation**: Passwords limited to reasonable length via API
- **No SQL/NoSQL**: No database - no SQL injection risk

## Troubleshooting

### Common Issues

#### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
```bash
# Kill process using port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port
PORT=3000 npm start
```

#### Canvas Animation Not Working

**Issue:** Chaos bubble background not animating

**Solutions:**
1. Check if JavaScript is enabled in browser
2. Verify no browser extensions blocking canvas (privacy blockers)
3. Mobile devices: Check "Low Power Mode" isn't enabled (disables animations)

#### CSS Not Loading

**Issue:** Page appears unstyled

**Solutions:**
1. Check browser console for 404 errors
2. Verify `public/` directory exists with CSS files
3. Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
4. Check that `express.static` is serving files correctly

#### API Endpoints Not Responding

**Issue:** "Error analyzing password" messages

**Solutions:**
1. Check server is running: `curl http://localhost:5000/health`
2. Verify no CORS errors in browser console
3. Check server logs for errors
4. Ensure `NODE_ENV` is not set incorrectly

### Docker Issues

#### Container Won't Start

```bash
# Check Docker logs
docker logs <container-id>

# Rebuild with no cache
docker build --no-cache -t password-entropy .
```

#### Health Check Failing

The health check uses Node.js to ping the `/health` endpoint. If it fails:
1. Ensure the server is actually listening on port 5000 inside the container
2. Check the container can reach itself via localhost

## Performance Tips

### For Mobile Devices

- **Disable Canvas**: On very low-end devices, the animation can be disabled by adding `?noanim=true` to the URL (if implemented)
- **Reduce Bubbles**: The animation automatically reduces bubble count on mobile (12 vs 25)
- **Frame Skipping**: Mobile devices get 30fps instead of 60fps to save battery

### For Production

- **CDN**: Serve static assets from a CDN in production
- **Compression**: Enable gzip/brotli compression (Express does this automatically with proper middleware)
- **Caching**: Static assets are cached for 1 year in production mode (`maxAge: '1y'`)

## Technologies

- **Backend**: Node.js 18+, Express.js 4.18.2
- **Frontend**: Vanilla JavaScript (ES6+), Bootstrap 5.3.8, Bootstrap Icons 1.11.1
- **Styling**: CSS3 with CSS Custom Properties (variables)
- **Animation**: HTML5 Canvas API with requestAnimationFrame
- **Crypto**: Node.js built-in `crypto` module for secure random generation
- **Container**: Docker with Node.js 18 Alpine image

## Development

### Project Scripts

```bash
# Start production server
npm start

# Development mode (same as start)
npm run dev

# Build (no-op for this project)
npm run build
```

### Code Style

- **Backend**: CommonJS modules (`require`/`module.exports`)
- **Frontend**: ES6+ features, vanilla JavaScript (no frameworks)
- **CSS**: Modular CSS with BEM-like naming conventions
- **Indentation**: 4 spaces for JavaScript, 2 spaces for CSS

### Adding New Features

1. **New API Endpoint**: Add route file in `src/routes/`, import in `src/server.js`
2. **New CSS**: Create module in `public/css/`, link in `views/index.html`
3. **New JavaScript**: Create module in `public/js/`, load after dependencies in HTML
4. **Mobile Support**: Test all changes at 375px, 575px, 767px, and 991px breakpoints

### Testing Checklist

Before submitting changes:
- [ ] Works on desktop (Chrome, Firefox, Safari)
- [ ] Works on mobile (iOS Safari, Chrome Mobile)
- [ ] Canvas animation performs well on mobile
- [ ] All buttons have 44×44px touch targets
- [ ] No horizontal scroll on mobile
- [ ] API endpoints return correct responses
- [ ] No console errors
- [ ] Password generation works with all character type combinations

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'Add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Contribution Ideas

- Add password history/local storage
- Add dark/light theme toggle
- Add password sharing (secure link generation)
- Add unit tests
- Add i18n (internationalization) support
- Add accessibility improvements (ARIA labels, screen reader support)
- Optimize canvas animation further
- Add password breach checking (Have I Been Pwned API integration)

## Acknowledgments

- **Bootstrap**: UI framework and icons by [Bootstrap](https://getbootstrap.com/)
- **zxcvbn**: Password strength estimation library by Dropbox
- **Canvas Animation**: Chaos bubble animation inspired by particle network concepts
- **Entropy Calculation**: Based on standard information entropy formulas (Shannon entropy)

## License

MIT License - See [LICENSE](LICENSE) file for details

---

**Made with ❤️ by [nkv-dev](https://github.com/nkv-dev)**

If you found this project helpful, please ⭐ star the repository!

## Author

**nkv-dev**
- GitHub: [@nkv-dev](https://github.com/nkv-dev)
- LinkedIn: [nkv-dev](https://linkedin.com/in/nkv-dev)

## Changelog

### v1.1.0 (2026-02-03)
- **Restructured**: Modular architecture with separate CSS/JS files
- **Mobile UI**: Comprehensive mobile optimization with 4 breakpoints
- **Bootstrap Update**: Upgraded from 5.3.2 to 5.3.8
- **Performance**: Canvas animation frame skipping for mobile battery saving
- **Deleted**: Removed test.html and server.log from repository

### v1.0.0 (Initial Release)
- Password entropy analysis and generation
- Chaos bubble animated background
- Glass-morphism UI design
- Real-time password strength feedback
