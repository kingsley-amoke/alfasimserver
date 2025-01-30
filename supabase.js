const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supaUrl = process.env.SUPABASE_URL;
const supaAnonKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supaUrl, supaAnonKey);

module.exports = supabase;
