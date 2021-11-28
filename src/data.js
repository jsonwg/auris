import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://pzvzrkqynycwvaldbuxb.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzODA2MDU4MCwiZXhwIjoxOTUzNjM2NTgwfQ.lTpDBE_2yO6FkG90lpIQogK5kSi0nq99OGqDjoBAkPQ'
);

export async function readDB() {
  const { data, error } = await supabase.from('anime').select();
  const database = {};
  for (const anime of data) {
    database[anime['link']] = anime['anime'];
  }
  return database;
}

export async function writeToDB(anime, song, artist, type, link) {
  const time = Date.now();

  const { data, error } = await supabase
    .from('anime')
    .insert([{ anime, song, artist, type, link, time }]);

  if (data === null) {
    console.log('You are not authorized to modify the database');
  }
}
