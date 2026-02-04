import { Metadata } from 'next';

export function generateLeagueMetadata(league: string): Metadata {
  const leagueNames: Record<string, { title: string; description: string; keywords: string[] }> = {
    'premier-league': {
      title: 'Premier League Forudsigelser | AI Kampanalyse & Odds',
      description: 'Få AI-baserede forudsigelser for Premier League kampe. Avanceret analyse af engelske fodboldkampe med sandsynligheder, forventede resultater og nøglefaktorer.',
      keywords: ['premier league forudsigelser', 'engelsk fodbold', 'AI forudsigelser', 'kampanalyse', 'Liverpool', 'Man City', 'Arsenal', 'Chelsea']
    },
    'la-liga': {
      title: 'La Liga Forudsigelser | AI Kampanalyse & Odds',
      description: 'Få AI-baserede forudsigelser for La Liga kampe. Avanceret analyse af spanske fodboldkampe med sandsynligheder, forventede resultater og nøglefaktorer.',
      keywords: ['la liga forudsigelser', 'spansk fodbold', 'AI forudsigelser', 'kampanalyse', 'Real Madrid', 'Barcelona', 'Atletico Madrid']
    },
    'bundesliga': {
      title: 'Bundesliga Forudsigelser | AI Kampanalyse & Odds',
      description: 'Få AI-baserede forudsigelser for Bundesliga kampe. Avanceret analyse af tyske fodboldkampe med sandsynligheder, forventede resultater og nøglefaktorer.',
      keywords: ['bundesliga forudsigelser', 'tysk fodbold', 'AI forudsigelser', 'kampanalyse', 'Bayern Munich', 'Dortmund', 'RB Leipzig']
    },
    'serie-a': {
      title: 'Serie A Forudsigelser | AI Kampanalyse & Odds',
      description: 'Få AI-baserede forudsigelser for Serie A kampe. Avanceret analyse af italienske fodboldkampe med sandsynligheder, forventede resultater og nøglefaktorer.',
      keywords: ['serie a forudsigelser', 'italiensk fodbold', 'AI forudsigelser', 'kampanalyse', 'Inter', 'Juventus', 'AC Milan', 'Napoli']
    },
    'ligue-1': {
      title: 'Ligue 1 Forudsigelser | AI Kampanalyse & Odds',
      description: 'Få AI-baserede forudsigelser for Ligue 1 kampe. Avanceret analyse af franske fodboldkampe med sandsynligheder, forventede resultater og nøglefaktorer.',
      keywords: ['ligue 1 forudsigelser', 'fransk fodbold', 'AI forudsigelser', 'kampanalyse', 'PSG', 'Monaco', 'Marseille', 'Lyon']
    },
    'superligaen': {
      title: 'Superligaen Forudsigelser | AI Kampanalyse & Odds',
      description: 'Få AI-baserede forudsigelser for Superligaen kampe. Avanceret analyse af danske fodboldkampe med sandsynligheder, forventede resultater og nøglefaktorer.',
      keywords: ['superligaen forudsigelser', 'dansk fodbold', 'AI forudsigelser', 'kampanalyse', 'FCK', 'Brøndby', 'FCM', 'AGF']
    }
  };

  const leagueData = leagueNames[league] || leagueNames['premier-league'];

  return {
    title: leagueData.title,
    description: leagueData.description,
    keywords: leagueData.keywords,
    openGraph: {
      title: leagueData.title,
      description: leagueData.description,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: leagueData.title,
      description: leagueData.description,
    },
  };
}
