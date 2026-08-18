import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync('.env','utf8').trim().split('\n').map(l => {
    const [k,...v] = l.split('=');
    return [k, v.join('=').replace(/"/g,'')];
  })
);

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

const did = 'did:htl:test-' + Date.now();

const insId = await supabase.from('identities').insert({
  did,
  public_key: 'ed25519:test:' + Math.random().toString(36).slice(2)
}).select().single();
console.log('IDENTITY INSERT:', insId.error ? 'ECHEC ' + insId.error.message : 'OK ' + insId.data.id);

const insScore = await supabase.from('trust_scores').insert({
  identity_id: insId.data.id,
  score: 842,
  entropy_bits: 4.2173,
  proof_hash: 'zkp:test:' + Math.random().toString(36).slice(2),
  device_class: 'tablet-android'
}).select().single();
console.log('SCORE INSERT:', insScore.error ? 'ECHEC ' + insScore.error.message : 'OK ' + insScore.data.id);

const readBack = await supabase.from('trust_scores')
  .select('score, identities(did)')
  .eq('id', insScore.data.id).single();
console.log('READBACK:', JSON.stringify(readBack.data));
