# Live Football Data Setup

This application can fetch real-time football match data from API-Football. Follow these steps to enable live data:

## Getting a Free API Key

1. **Visit API-Football**
   - Go to [https://www.api-football.com/](https://www.api-football.com/)

2. **Create a Free Account**
   - Click "Sign Up" or "Get Started"
   - Register with your email
   - Verify your email address

3. **Get Your API Key**
   - Log in to your dashboard
   - Navigate to "My Account" or "API Key"
   - Copy your API key

4. **Free Tier Limits**
   - 100 requests per day
   - Access to all leagues
   - Real-time match data
   - Perfect for this application!

## Configure the Application

1. **Create Environment File**
   ```bash
   # In the project root, create a file named .env.local
   touch .env.local
   ```

2. **Add Your API Key**
   ```env
   FOOTBALL_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual API key from API-Football

3. **Restart the Development Server**
   ```bash
   npm run dev
   ```

## How It Works

### With API Key (Live Data)
- ✅ Fetches real matches from all 6 leagues
- ✅ Shows actual match schedules for this week
- ✅ Displays live scores when matches are in progress
- ✅ Updates with real team statistics
- ✅ Green "Live data from API-Football" indicator

### Without API Key (Sample Data)
- ⚠️ Uses pre-configured sample matches
- ⚠️ Shows example teams and fixtures
- ⚠️ Red "Using sample data" indicator
- ⚠️ Still fully functional for testing predictions

## Supported Leagues

The application fetches data from:
- 🇩🇰 **Superligaen** (Danish Superliga)
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **Premier League** (England)
- 🇫🇷 **Ligue 1** (France)
- 🇩🇪 **Bundesliga** (Germany)
- 🇪🇸 **La Liga** (Spain)
- 🇮🇹 **Serie A** (Italy)

## Troubleshooting

### "Using sample data" message appears
- Check that your `.env.local` file exists
- Verify the API key is correct
- Ensure the file is in the project root
- Restart the dev server after adding the key

### No matches showing for a league
- Some leagues may not have matches this week
- Check the API-Football dashboard for your request count
- Verify the league is currently in season

### API Rate Limit Reached
- Free tier: 100 requests/day
- Each page load uses 6 requests (one per league)
- Consider caching or reducing refresh frequency
- Upgrade to a paid plan for more requests

## Alternative: Use Sample Data

The application works perfectly without an API key using realistic sample data. This is ideal for:
- Testing the prediction algorithms
- Demonstrating the ML features
- Development without API dependencies
- Avoiding rate limits

Simply don't add the API key, and the app will automatically use sample data!

## Security Note

⚠️ **Never commit your `.env.local` file to version control!**

The `.gitignore` file already excludes it, but always double-check before pushing code.
