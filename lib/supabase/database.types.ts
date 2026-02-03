export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teams: {
        Row: {
          id: string
          name: string
          league: string
          stats: Json
          form: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          league: string
          stats?: Json
          form?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          league?: string
          stats?: Json
          form?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      matches: {
        Row: {
          id: string
          league: string
          home_team_id: string
          away_team_id: string
          date: string
          status: string
          home_score: number | null
          away_score: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          league: string
          home_team_id: string
          away_team_id: string
          date: string
          status?: string
          home_score?: number | null
          away_score?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          league?: string
          home_team_id?: string
          away_team_id?: string
          date?: string
          status?: string
          home_score?: number | null
          away_score?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      predictions: {
        Row: {
          id: string
          match_id: string
          home_win_probability: number
          draw_probability: number
          away_win_probability: number
          predicted_home_score: number
          predicted_away_score: number
          confidence: number
          factors: Json
          created_at: string
        }
        Insert: {
          id?: string
          match_id: string
          home_win_probability: number
          draw_probability: number
          away_win_probability: number
          predicted_home_score: number
          predicted_away_score: number
          confidence: number
          factors?: Json
          created_at?: string
        }
        Update: {
          id?: string
          match_id?: string
          home_win_probability?: number
          draw_probability?: number
          away_win_probability?: number
          predicted_home_score?: number
          predicted_away_score?: number
          confidence?: number
          factors?: Json
          created_at?: string
        }
      }
    }
  }
}
