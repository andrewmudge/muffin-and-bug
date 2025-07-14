const bcrypt = require('bcryptjs');

async function debugPassword() {
  const password = "67uhnkuYUJD78d!!";
  const currentHash = "$2b$12$74T.dnulhffYHjoP7EP5MOUhczYHCs.v7CTop1Poe2R5sl9M1XjDK";
  
  console.log('Password:', JSON.stringify(password));
  console.log('Password length:', password.length);
  console.log('Current hash:', currentHash);
  
  // Test current hash
  const isCurrentValid = await bcrypt.compare(password, currentHash);
  console.log('Current hash valid:', isCurrentValid);
  
  // Generate new hash
  const newHash = await bcrypt.hash(password, 12);
  console.log('New hash:', newHash);
  
  // Test new hash
  const isNewValid = await bcrypt.compare(password, newHash);
  console.log('New hash valid:', isNewValid);
  
  // Test with different approaches
  const password2 = '67uhnkuYUJD78d!!';
  const isValid2 = await bcrypt.compare(password2, currentHash);
  console.log('Single quote password valid:', isValid2);
}

debugPassword().catch(console.error);
