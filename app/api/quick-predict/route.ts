import { NextResponse } from 'next/server';
import { findTeam } from '@/lib/utils/team-search';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { homeTeam, awayTeam } = body;

    if (!homeTeam || !awayTeam) {
      return NextResponse.json(
        { error: 'Begge holdnavne er påkrævet' },
        { status: 400 }
      );
    }

    // Find teams in database
    const homeTeamData = findTeam(homeTeam);
    const awayTeamData = findTeam(awayTeam);

    if (!homeTeamData) {
      return NextResponse.json(
        { error: `Kunne ikke finde hold: ${homeTeam}. Prøv f.eks. "FC København", "Manchester City", "Real Madrid"` },
        { status: 404 }
      );
    }

    if (!awayTeamData) {
      return NextResponse.json(
        { error: `Kunne ikke finde hold: ${awayTeam}. Prøv f.eks. "Brøndby IF", "Liverpool", "Barcelona"` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      homeTeam: homeTeamData,
      awayTeam: awayTeamData,
      message: 'Hold fundet succesfuldt'
    });
  } catch (error) {
    console.error('Error in quick-predict API:', error);
    return NextResponse.json(
      { error: 'Intern serverfejl' },
      { status: 500 }
    );
  }
}
