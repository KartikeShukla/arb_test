// Simple test script to verify Supabase connection and case submission
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://xztkmzhjrvgbyzcpiktf.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh6dGttemhqcnZnYnl6Y3Bpa3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MTI0NzgsImV4cCI6MjA1Nzk4ODQ3OH0.ZYGTv-Lia6MY8jYk77qL1DeJOxTeQm2P_AERNJqqZgM";

console.log('Supabase URL:', SUPABASE_URL);
console.log('Supabase Key Length:', SUPABASE_ANON_KEY?.length || 0);

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const testCaseData = {
  title: 'Test Case',
  description: 'This is a test case submission',
  claimant_name: 'Test User',
  claimant_email: 'test@example.com',
  respondent_name: 'Test Respondent',
  dispute_type: 'Test',
  status: 'pending'
};

async function runTest() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test case submission
    console.log('Inserting test case data:', testCaseData);
    const { data, error } = await supabase
      .from('case_submissions')
      .insert([testCaseData])
      .select();
      
    if (error) {
      console.error('Error inserting data:', error);
    } else {
      console.log('Success! Data inserted:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

runTest(); 