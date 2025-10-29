const bcrypt = require('bcryptjs');

async function gerarHash() {
    const senha = 'teste123';
    const hash = await bcrypt.hash(senha, 10);
    console.log('\n=================================');
    console.log('HASH GERADO PARA A SENHA: teste123');
    console.log('=================================');
    console.log(hash);
    console.log('\n=================================');
    console.log('EXECUTE NO MySQL:');
    console.log('=================================');
    console.log(`UPDATE usuarios SET senha_hash = '${hash}' WHERE email = 'teste@exemplo.com';`);
    console.log('\n');
}

gerarHash();