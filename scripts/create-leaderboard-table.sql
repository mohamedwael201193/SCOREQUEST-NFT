-- Create leaderboard table for storing game scores
CREATE TABLE IF NOT EXISTS leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  wallet_address VARCHAR(42),
  score INTEGER NOT NULL,
  time_taken INTEGER NOT NULL, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_leaderboard_score ON leaderboard(score DESC, time_taken ASC);

-- Insert some sample data for testing
INSERT INTO leaderboard (player_name, wallet_address, score, time_taken) VALUES
('CyberNinja', '0x1234567890123456789012345678901234567890', 20, 45),
('QuantumGamer', '0x2345678901234567890123456789012345678901', 18, 52),
('NeonHacker', '0x3456789012345678901234567890123456789012', 16, 48),
('DigitalWarrior', '0x4567890123456789012345678901234567890123', 15, 55),
('CyberPunk2077', '0x5678901234567890123456789012345678901234', 14, 60);
