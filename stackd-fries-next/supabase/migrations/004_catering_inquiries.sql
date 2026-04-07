CREATE TABLE IF NOT EXISTS catering_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  event_date date NOT NULL,
  headcount integer NOT NULL,
  event_type text NOT NULL,
  message text,
  status text DEFAULT 'new',
  created_at timestamptz DEFAULT now()
);
ALTER TABLE catering_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert catering" ON catering_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read catering" ON catering_inquiries FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Admin update catering" ON catering_inquiries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE INDEX idx_catering_created_at ON catering_inquiries (created_at DESC);
