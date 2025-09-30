const { normalizeText } = require('./lib/utils.js');

console.log('Teste de normalização:');
console.log('saúde ->', normalizeText('saúde'));
console.log('Saúde ->', normalizeText('Saúde'));
console.log('SAÚDE ->', normalizeText('SAÚDE'));
console.log('limpeza ->', normalizeText('limpeza'));
console.log('Limpeza ->', normalizeText('Limpeza'));

// Teste com diferentes tipos de acentos
console.log('\nTeste com diferentes acentos:');
console.log('á ->', normalizeText('á'));
console.log('é ->', normalizeText('é'));
console.log('í ->', normalizeText('í'));
console.log('ó ->', normalizeText('ó'));
console.log('ú ->', normalizeText('ú'));
console.log('ã ->', normalizeText('ã'));
console.log('õ ->', normalizeText('õ'));
console.log('ç ->', normalizeText('ç'));

// Teste com string completa
console.log('\nTeste com strings completas:');
console.log('"Saúde para Todos" ->', normalizeText('Saúde para Todos'));
console.log('"Limpeza da Praia" ->', normalizeText('Limpeza da Praia'));

