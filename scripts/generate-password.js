const bcrypt = require('bcryptjs');

async function generatePasswordHash() {
  const password = process.argv[2];
  
  if (!password) {
    console.log('Usage: node generate-password.js <your-password>');
    process.exit(1);
  }

  try {
    const saltRounds = 12;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('Password Hash Generated:');
    console.log(hash);
    console.log('\nAdd this to your .env.local file:');
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
  } catch (error) {
    console.error('Error generating hash:', error);
  }
}

generatePasswordHash();
