#!/usr/bin/env node

/**
 * Script de test automatisé pour l'API RESTful
 * Utilise les modules Node.js pour tester automatiquement tous les endpoints
 *
 * Usage: node test-api.js
 */

const http = require('http');
const https = require('https');

const BASE_URL = 'http://localhost:3000';
const API_KEY = 'dev-secret-key';

// Fonction utilitaire pour faire des requêtes HTTP
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(options.path, BASE_URL);
    const reqOptions = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = http.request(reqOptions, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : null;
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: jsonBody,
            rawBody: body
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: null,
            rawBody: body,
            parseError: e.message
          });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Tests
async function runTests() {
  console.log('🚀 Démarrage des tests automatisés de l\'API...\n');

  const results = {
    passed: 0,
    failed: 0,
    total: 0
  };

  function test(name, condition, details = '') {
    results.total++;
    if (condition) {
      results.passed++;
      console.log(`✅ ${name}`);
      if (details) console.log(`   ${details}`);
    } else {
      results.failed++;
      console.log(`❌ ${name}`);
      if (details) console.log(`   ${details}`);
    }
  }

  try {
    // Test 1: Endpoint racine
    console.log('📋 Test de l\'endpoint racine...');
    const rootResponse = await makeRequest({ path: '/' });
    test('GET / retourne 200', rootResponse.status === 200);
    test('GET / contient un message', rootResponse.body && rootResponse.body.message);

    // Test 2: Liste des jeux (vide au départ)
    console.log('\n📋 Test de la liste des jeux...');
    const listResponse = await makeRequest({ path: '/api/v1/games' });
    console.log('Status:', listResponse.status);
    console.log('Body:', listResponse.body);
    console.log('Raw body:', listResponse.rawBody);
    test('GET /api/v1/games retourne 200', listResponse.status === 200);
    test('GET /api/v1/games retourne un objet avec data', listResponse.body && Array.isArray(listResponse.body.data));

    // Test 3: Création d'un jeu
    console.log('\n📋 Test de création d\'un jeu...');
    const createResponse = await makeRequest({
      method: 'POST',
      path: '/api/v1/games',
      headers: { 'x-api-key': API_KEY }
    }, {
      title: 'Test Game Automated',
      platform: 'PC',
      rating: 8.5
    });
    test('POST /api/v1/games retourne 201', createResponse.status === 201);
    test('POST /api/v1/games retourne le jeu créé', createResponse.body && createResponse.body.data);
    const createdGame = createResponse.body.data;
    const gameId = createdGame.id;

    // Test 4: Récupération du jeu créé
    console.log('\n📋 Test de récupération du jeu...');
    const getResponse = await makeRequest({ path: `/api/v1/games/${gameId}` });
    test('GET /api/v1/games/:id retourne 200', getResponse.status === 200);
    test('GET /api/v1/games/:id retourne le bon jeu', getResponse.body && getResponse.body.title === 'Test Game Automated');
    test('GET /api/v1/games/:id contient HATEOAS links', getResponse.body && getResponse.body._links);

    // Test 5: Mise à jour du jeu
    console.log('\n📋 Test de mise à jour du jeu...');
    const updateResponse = await makeRequest({
      method: 'PATCH',
      path: `/api/v1/games/${gameId}`,
      headers: { 'x-api-key': API_KEY }
    }, {
      rating: 9.0,
      description: 'Updated by automated test'
    });
    test('PATCH /api/v1/games/:id retourne 200', updateResponse.status === 200);
    test('PATCH /api/v1/games/:id met à jour le rating', updateResponse.body && updateResponse.body.data && updateResponse.body.data.rating === 9.0);

    // Test 6: Content Negotiation - XML
    console.log('\n📋 Test de content negotiation (XML)...');
    const xmlResponse = await makeRequest({
      path: `/api/v1/games/${gameId}`,
      headers: { 'Accept': 'application/xml' }
    });
    test('GET avec Accept: application/xml retourne XML', xmlResponse.headers['content-type'] && xmlResponse.headers['content-type'].includes('xml'));

    // Test 7: Content Negotiation - YAML
    console.log('\n📋 Test de content negotiation (YAML)...');
    const yamlResponse = await makeRequest({
      path: `/api/v1/games/${gameId}`,
      headers: { 'Accept': 'application/yaml' }
    });
    test('GET avec Accept: application/yaml retourne YAML', yamlResponse.headers['content-type'] && yamlResponse.headers['content-type'].includes('yaml'));

    // Test 8: i18n - Anglais
    console.log('\n📋 Test d\'internationalisation...');
    const enResponse = await makeRequest({ path: '/?lang=en' });
    test('GET /?lang=en fonctionne', enResponse.status === 200);

    // Test 9: Erreurs
    console.log('\n📋 Test des erreurs...');
    const notFoundResponse = await makeRequest({ path: '/api/v1/games/99999' });
    test('GET /api/v1/games/99999 retourne 404', notFoundResponse.status === 404);

    const unauthorizedResponse = await makeRequest({
      method: 'POST',
      path: '/api/v1/games'
    }, { title: 'Test' });
    test('POST sans API key retourne 401', unauthorizedResponse.status === 401);

    // Test 10: Suppression
    console.log('\n📋 Test de suppression...');
    const deleteResponse = await makeRequest({
      method: 'DELETE',
      path: `/api/v1/games/${gameId}`,
      headers: { 'x-api-key': API_KEY }
    });
    test('DELETE /api/v1/games/:id retourne 204', deleteResponse.status === 204);

    // Vérifier que le jeu est supprimé
    const getAfterDelete = await makeRequest({ path: `/api/v1/games/${gameId}` });
    test('GET après DELETE retourne 404', getAfterDelete.status === 404);

  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
    results.failed++;
    results.total++;
  }

  // Résumé
  console.log('\n' + '='.repeat(50));
  console.log('📊 RÉSULTATS DES TESTS');
  console.log('='.repeat(50));
  console.log(`Total: ${results.total}`);
  console.log(`Réussis: ${results.passed}`);
  console.log(`Échoués: ${results.failed}`);
  console.log(`Taux de succès: ${((results.passed / results.total) * 100).toFixed(1)}%`);

  if (results.failed === 0) {
    console.log('🎉 Tous les tests sont passés !');
  } else {
    console.log('⚠️ Certains tests ont échoué. Vérifiez les logs ci-dessus.');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Lancer les tests
if (require.main === module) {
  runTests();
}

module.exports = { runTests, makeRequest };