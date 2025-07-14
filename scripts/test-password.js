const bcrypt = require('bcryptjs');

async function testPassword() {
  const testPassword = process.argv[2];
  const storedHash = '$2b$12$74T.dnulhffYHjoP7EP5MOUhczYHCs.v7CTop1Poe2R5sl9M1XjDK';
  
  if (!testPassword) {
    console.log('Usage: node test-password.js <password-to-test>');
    process.exit(1);
  }

  try {
    const isMatch = await bcrypt.compare(testPassword, storedHash);
    console.log(`Password "${testPassword}" matches stored hash: ${isMatch}`);
  } catch (error) {
    console.error('Error testing password:', error);
  }
}

testPassword();
