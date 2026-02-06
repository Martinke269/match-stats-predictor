export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      algorithm_versions: {
        Row: {
          changes: Json | null
          created_at: string
          deployed_at: string
          deprecated_at: string | null
          description: string | null
          id: string
          is_active: boolean
          notes: string | null
          version: string
          version_number: number | null
          weights: Json | null
        }
        Insert: {
          changes?: Json | null
          created_at?: string
          deployed_at?: string
          deprecated_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          version: string
          version_number?: number | null
          weights?: Json | null
        }
        Update: {
          changes?: Json | null
          created_at?: string
          deployed_at?: string
          deprecated_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean
          notes?: string | null
          version?: string
          version_number?: number | null
          weights?: Json | null
        }
        Relationships: []
      }
      calculation_edge_cases: {
        Row: {
          calculation_id: string
          created_at: string
          description: string
          edge_case_type: string
          handling_strategy: string | null
          id: string
          severity: string
          trigger_data: Json | null
        }
        Insert: {
          calculation_id: string
          created_at?: string
          description: string
          edge_case_type: string
          handling_strategy?: string | null
          id?: string
          severity: string
          trigger_data?: Json | null
        }
        Update: {
          calculation_id?: string
          created_at?: string
          description?: string
          edge_case_type?: string
          handling_strategy?: string | null
          id?: string
          severity?: string
          trigger_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "calculation_edge_cases_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      calculation_errors: {
        Row: {
          calculation_id: string | null
          created_at: string
          error_code: string | null
          error_message: string
          error_stack: string | null
          error_type: string
          id: string
          match_id: string | null
          occurred_at: string
          request_data: Json | null
          resolution_notes: string | null
          resolved: boolean | null
          resolved_at: string | null
          system_state: Json | null
        }
        Insert: {
          calculation_id?: string | null
          created_at?: string
          error_code?: string | null
          error_message: string
          error_stack?: string | null
          error_type: string
          id?: string
          match_id?: string | null
          occurred_at?: string
          request_data?: Json | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          system_state?: Json | null
        }
        Update: {
          calculation_id?: string | null
          created_at?: string
          error_code?: string | null
          error_message?: string
          error_stack?: string | null
          error_type?: string
          id?: string
          match_id?: string | null
          occurred_at?: string
          request_data?: Json | null
          resolution_notes?: string | null
          resolved?: boolean | null
          resolved_at?: string | null
          system_state?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "calculation_errors_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "calculations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculation_errors_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      calculation_factors: {
        Row: {
          calculation_id: string
          created_at: string
          factor_category: string | null
          factor_description: string
          factor_impact: string
          factor_name: string
          factor_weight: number
          id: string
        }
        Insert: {
          calculation_id: string
          created_at?: string
          factor_category?: string | null
          factor_description: string
          factor_impact: string
          factor_name: string
          factor_weight: number
          id?: string
        }
        Update: {
          calculation_id?: string
          created_at?: string
          factor_category?: string | null
          factor_description?: string
          factor_impact?: string
          factor_name?: string
          factor_weight?: number
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "calculation_factors_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      calculation_inputs: {
        Row: {
          after_winter_break: boolean | null
          away_fixture_congestion: Json | null
          away_team_form: string
          away_team_id: string
          away_team_stats: Json
          calculation_id: string
          created_at: string
          head_to_head_stats: Json | null
          home_fixture_congestion: Json | null
          home_team_form: string
          home_team_id: string
          home_team_stats: Json
          id: string
          is_derby: boolean | null
          league: string
          match_date: string
          winter_break_months: number | null
        }
        Insert: {
          after_winter_break?: boolean | null
          away_fixture_congestion?: Json | null
          away_team_form: string
          away_team_id: string
          away_team_stats: Json
          calculation_id: string
          created_at?: string
          head_to_head_stats?: Json | null
          home_fixture_congestion?: Json | null
          home_team_form: string
          home_team_id: string
          home_team_stats: Json
          id?: string
          is_derby?: boolean | null
          league: string
          match_date: string
          winter_break_months?: number | null
        }
        Update: {
          after_winter_break?: boolean | null
          away_fixture_congestion?: Json | null
          away_team_form?: string
          away_team_id?: string
          away_team_stats?: Json
          calculation_id?: string
          created_at?: string
          head_to_head_stats?: Json | null
          home_fixture_congestion?: Json | null
          home_team_form?: string
          home_team_id?: string
          home_team_stats?: Json
          id?: string
          is_derby?: boolean | null
          league?: string
          match_date?: string
          winter_break_months?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculation_inputs_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculation_inputs_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "calculations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculation_inputs_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      calculation_metadata: {
        Row: {
          away_form_score: number | null
          away_quality_score: number | null
          calculation_id: string
          created_at: string
          home_form_score: number | null
          home_quality_score: number | null
          id: string
          ip_address: unknown
          is_home_underdog: boolean | null
          options_used: Json
          quality_gap: number | null
          request_source: string | null
          upset_bonus: number | null
          user_agent: string | null
        }
        Insert: {
          away_form_score?: number | null
          away_quality_score?: number | null
          calculation_id: string
          created_at?: string
          home_form_score?: number | null
          home_quality_score?: number | null
          id?: string
          ip_address?: unknown
          is_home_underdog?: boolean | null
          options_used: Json
          quality_gap?: number | null
          request_source?: string | null
          upset_bonus?: number | null
          user_agent?: string | null
        }
        Update: {
          away_form_score?: number | null
          away_quality_score?: number | null
          calculation_id?: string
          created_at?: string
          home_form_score?: number | null
          home_quality_score?: number | null
          id?: string
          ip_address?: unknown
          is_home_underdog?: boolean | null
          options_used?: Json
          quality_gap?: number | null
          request_source?: string | null
          upset_bonus?: number | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "calculation_metadata_calculation_id_fkey"
            columns: ["calculation_id"]
            isOneToOne: false
            referencedRelation: "calculations"
            referencedColumns: ["id"]
          },
        ]
      }
      calculation_performance: {
        Row: {
          algorithm_version_id: string | null
          avg_accuracy_score: number | null
          avg_calculation_time_ms: number | null
          avg_confidence: number | null
          correct_predictions: number | null
          created_at: string
          exact_score_predictions: number | null
          id: string
          max_calculation_time_ms: number | null
          min_calculation_time_ms: number | null
          period_end: string
          period_start: string
          total_calculations: number
          total_evaluated: number | null
        }
        Insert: {
          algorithm_version_id?: string | null
          avg_accuracy_score?: number | null
          avg_calculation_time_ms?: number | null
          avg_confidence?: number | null
          correct_predictions?: number | null
          created_at?: string
          exact_score_predictions?: number | null
          id?: string
          max_calculation_time_ms?: number | null
          min_calculation_time_ms?: number | null
          period_end: string
          period_start: string
          total_calculations: number
          total_evaluated?: number | null
        }
        Update: {
          algorithm_version_id?: string | null
          avg_accuracy_score?: number | null
          avg_calculation_time_ms?: number | null
          avg_confidence?: number | null
          correct_predictions?: number | null
          created_at?: string
          exact_score_predictions?: number | null
          id?: string
          max_calculation_time_ms?: number | null
          min_calculation_time_ms?: number | null
          period_end?: string
          period_start?: string
          total_calculations?: number
          total_evaluated?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "calculation_performance_algorithm_version_id_fkey"
            columns: ["algorithm_version_id"]
            isOneToOne: false
            referencedRelation: "algorithm_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      calculations: {
        Row: {
          accuracy_score: number | null
          actual_away_score: number | null
          actual_home_score: number | null
          algorithm_version_id: string
          away_win_probability: number
          calculated_at: string
          calculation_duration_ms: number | null
          confidence: number
          created_at: string
          draw_probability: number
          evaluated_at: string | null
          evaluation_type: string | null
          home_win_probability: number
          id: string
          match_id: string
          predicted_away_score: number
          predicted_home_score: number
          updated_at: string
          was_correct: boolean | null
        }
        Insert: {
          accuracy_score?: number | null
          actual_away_score?: number | null
          actual_home_score?: number | null
          algorithm_version_id: string
          away_win_probability: number
          calculated_at?: string
          calculation_duration_ms?: number | null
          confidence: number
          created_at?: string
          draw_probability: number
          evaluated_at?: string | null
          evaluation_type?: string | null
          home_win_probability: number
          id?: string
          match_id: string
          predicted_away_score: number
          predicted_home_score: number
          updated_at?: string
          was_correct?: boolean | null
        }
        Update: {
          accuracy_score?: number | null
          actual_away_score?: number | null
          actual_home_score?: number | null
          algorithm_version_id?: string
          away_win_probability?: number
          calculated_at?: string
          calculation_duration_ms?: number | null
          confidence?: number
          created_at?: string
          draw_probability?: number
          evaluated_at?: string | null
          evaluation_type?: string | null
          home_win_probability?: number
          id?: string
          match_id?: string
          predicted_away_score?: number
          predicted_home_score?: number
          updated_at?: string
          was_correct?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "calculations_algorithm_version_id_fkey"
            columns: ["algorithm_version_id"]
            isOneToOne: false
            referencedRelation: "algorithm_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "calculations_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: false
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
        ]
      }
      matches: {
        Row: {
          away_score: number | null
          away_team_id: string
          created_at: string
          date: string
          home_score: number | null
          home_team_id: string
          id: string
          league: string
          status: string
          updated_at: string
        }
        Insert: {
          away_score?: number | null
          away_team_id: string
          created_at?: string
          date: string
          home_score?: number | null
          home_team_id: string
          id?: string
          league: string
          status?: string
          updated_at?: string
        }
        Update: {
          away_score?: number | null
          away_team_id?: string
          created_at?: string
          date?: string
          home_score?: number | null
          home_team_id?: string
          id?: string
          league?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "matches_away_team_id_fkey"
            columns: ["away_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "matches_home_team_id_fkey"
            columns: ["home_team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
        ]
      }
      news_events: {
        Row: {
          content_hash: string
          created_at: string
          detected_at: string
          event_type: string
          id: string
          league: string
          player: string | null
          severity: string | null
          source_url: string | null
          summary: string
          team: string
          updated_at: string
        }
        Insert: {
          content_hash: string
          created_at?: string
          detected_at?: string
          event_type: string
          id?: string
          league: string
          player?: string | null
          severity?: string | null
          source_url?: string | null
          summary: string
          team: string
          updated_at?: string
        }
        Update: {
          content_hash?: string
          created_at?: string
          detected_at?: string
          event_type?: string
          id?: string
          league?: string
          player?: string | null
          severity?: string | null
          source_url?: string | null
          summary?: string
          team?: string
          updated_at?: string
        }
        Relationships: []
      }
      prediction_runs: {
        Row: {
          algorithm_version_id: string | null
          created_at: string | null
          error_details: Json | null
          failed_predictions: number | null
          finished_at: string | null
          id: string
          new_predictions: number | null
          notes: string | null
          run_type: string
          started_at: string
          total_predictions: number | null
          updated_predictions: number | null
        }
        Insert: {
          algorithm_version_id?: string | null
          created_at?: string | null
          error_details?: Json | null
          failed_predictions?: number | null
          finished_at?: string | null
          id?: string
          new_predictions?: number | null
          notes?: string | null
          run_type: string
          started_at?: string
          total_predictions?: number | null
          updated_predictions?: number | null
        }
        Update: {
          algorithm_version_id?: string | null
          created_at?: string | null
          error_details?: Json | null
          failed_predictions?: number | null
          finished_at?: string | null
          id?: string
          new_predictions?: number | null
          notes?: string | null
          run_type?: string
          started_at?: string
          total_predictions?: number | null
          updated_predictions?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prediction_runs_algorithm_version_id_fkey"
            columns: ["algorithm_version_id"]
            isOneToOne: false
            referencedRelation: "algorithm_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      prediction_stats: {
        Row: {
          accuracy_percentage: number | null
          correct_predictions: number | null
          id: string
          last_updated: string | null
          league: string
          total_predictions: number | null
        }
        Insert: {
          accuracy_percentage?: number | null
          correct_predictions?: number | null
          id?: string
          last_updated?: string | null
          league: string
          total_predictions?: number | null
        }
        Update: {
          accuracy_percentage?: number | null
          correct_predictions?: number | null
          id?: string
          last_updated?: string | null
          league?: string
          total_predictions?: number | null
        }
        Relationships: []
      }
      predictions: {
        Row: {
          actual_away_score: number | null
          actual_home_score: number | null
          actual_result: string | null
          algorithm_version_id: string | null
          away_win_probability: number
          confidence: number
          created_at: string
          draw_probability: number
          factors: Json
          home_win_probability: number
          id: string
          last_updated_at: string | null
          match_id: string
          news_events_considered: Json | null
          predicted_away_score: number
          predicted_home_score: number
          prediction_run_id: string | null
          result_type: string | null
          update_reason: string | null
          updated_at: string | null
          was_correct: boolean | null
        }
        Insert: {
          actual_away_score?: number | null
          actual_home_score?: number | null
          actual_result?: string | null
          algorithm_version_id?: string | null
          away_win_probability: number
          confidence: number
          created_at?: string
          draw_probability: number
          factors?: Json
          home_win_probability: number
          id?: string
          last_updated_at?: string | null
          match_id: string
          news_events_considered?: Json | null
          predicted_away_score: number
          predicted_home_score: number
          prediction_run_id?: string | null
          result_type?: string | null
          update_reason?: string | null
          updated_at?: string | null
          was_correct?: boolean | null
        }
        Update: {
          actual_away_score?: number | null
          actual_home_score?: number | null
          actual_result?: string | null
          algorithm_version_id?: string | null
          away_win_probability?: number
          confidence?: number
          created_at?: string
          draw_probability?: number
          factors?: Json
          home_win_probability?: number
          id?: string
          last_updated_at?: string | null
          match_id?: string
          news_events_considered?: Json | null
          predicted_away_score?: number
          predicted_home_score?: number
          prediction_run_id?: string | null
          result_type?: string | null
          update_reason?: string | null
          updated_at?: string | null
          was_correct?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "predictions_algorithm_version_id_fkey"
            columns: ["algorithm_version_id"]
            isOneToOne: false
            referencedRelation: "algorithm_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_match_id_fkey"
            columns: ["match_id"]
            isOneToOne: true
            referencedRelation: "matches"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_prediction_run_id_fkey"
            columns: ["prediction_run_id"]
            isOneToOne: false
            referencedRelation: "prediction_runs"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          created_at: string
          form: string[]
          id: string
          league: string
          name: string
          stats: Json
          updated_at: string
        }
        Insert: {
          created_at?: string
          form?: string[]
          id?: string
          league: string
          name: string
          stats?: Json
          updated_at?: string
        }
        Update: {
          created_at?: string
          form?: string[]
          id?: string
          league?: string
          name?: string
          stats?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
