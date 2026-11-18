'use strict';

const assert = require('assert/strict');
const {
  STORAGE_KEY,
  DEFAULT_CONFIG,
  normalizeUrl,
  loadConfig,
  saveConfig,
  navigateGrid,
  trapModalFocus,
  formatClock,
  formatIndonesianDate,
} = require('./app.js');

function createMockStorage(initial = {}) {
  const store = new Map(Object.entries(initial));
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
  };
}

let passed = 0;
function test(name, fn) {
  fn();
  passed += 1;
  console.log(`PASS: ${name}`);
}

// --- normalizeUrl ---
test('normalizeUrl prepends http:// when protocol is missing and trims spaces', () => {
  assert.equal(normalizeUrl('  192.168.1.50:8080  ', DEFAULT_CONFIG.senandung), 'http://192.168.1.50:8080');
});

test('normalizeUrl preserves https:// and trims trailing slashes cleanly', () => {
  assert.equal(normalizeUrl('https://immich.home.arpa///', DEFAULT_CONFIG.immich), 'https://immich.home.arpa');
  assert.equal(normalizeUrl('  HTTP://nas.local:3000/  ', DEFAULT_CONFIG.dompetmungil), 'HTTP://nas.local:3000');
});

test('normalizeUrl falls back when input is empty, whitespace, or non-string', () => {
  assert.equal(normalizeUrl('', DEFAULT_CONFIG.senandung), DEFAULT_CONFIG.senandung);
  assert.equal(normalizeUrl('   ', DEFAULT_CONFIG.immich), DEFAULT_CONFIG.immich);
  assert.equal(normalizeUrl(null, DEFAULT_CONFIG.dompetmungil), DEFAULT_CONFIG.dompetmungil);
  assert.equal(normalizeUrl(undefined, DEFAULT_CONFIG.senandung), DEFAULT_CONFIG.senandung);
});

// --- loadConfig / saveConfig ---
test('loadConfig returns DEFAULT_CONFIG when storage is missing, empty, or corrupt JSON', () => {
  assert.deepEqual(loadConfig(null), DEFAULT_CONFIG);
  assert.deepEqual(loadConfig(createMockStorage()), DEFAULT_CONFIG);
  assert.deepEqual(loadConfig(createMockStorage({ [STORAGE_KEY]: '{not-valid-json' })), DEFAULT_CONFIG);
  assert.deepEqual(loadConfig(createMockStorage({ [STORAGE_KEY]: 'null' })), DEFAULT_CONFIG);
});

test('saveConfig persists normalized URLs and loadConfig reloads them from mock localStorage', () => {
  const mockStorage = createMockStorage();
  const saved = saveConfig(
    {
      senandung: '10.0.0.10:8080/',
      immich: 'https://photos.local///',
      dompetmungil: '  10.0.0.10:3000  ',
    },
    mockStorage
  );

  const expected = {
    senandung: 'http://10.0.0.10:8080',
    immich: 'https://photos.local',
    dompetmungil: 'http://10.0.0.10:3000',
  };

  assert.deepEqual(saved, expected);
  assert.deepEqual(loadConfig(mockStorage), expected);
});

test('loadConfig and saveConfig fall back to DEFAULT_CONFIG for omitted fields', () => {
  const mockStorage = createMockStorage();
  saveConfig({ senandung: '192.168.10.2:9000' }, mockStorage);
  assert.deepEqual(loadConfig(mockStorage), {
    senandung: 'http://192.168.10.2:9000',
    immich: DEFAULT_CONFIG.immich,
    dompetmungil: DEFAULT_CONFIG.dompetmungil,
  });
});

// --- navigateGrid ---
test('navigateGrid moves across a 3x3 grid and clamps at all boundaries', () => {
  const grid = [3, 3, 3];

  // Top-left boundary clamping
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowLeft'), { row: 0, col: 0 });
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowUp'), { row: 0, col: 0 });

  // Normal movement
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowRight'), { row: 0, col: 1 });
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 1 }, 'ArrowDown'), { row: 1, col: 1 });
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 1 }, 'ArrowLeft'), { row: 1, col: 0 });
  assert.deepEqual(navigateGrid(grid, { row: 2, col: 2 }, 'ArrowUp'), { row: 1, col: 2 });

  // Bottom-right boundary clamping
  assert.deepEqual(navigateGrid(grid, { row: 2, col: 2 }, 'ArrowRight'), { row: 2, col: 2 });
  assert.deepEqual(navigateGrid(grid, { row: 2, col: 2 }, 'ArrowDown'), { row: 2, col: 2 });
});

test('navigateGrid handles uneven row lengths and empty grids cleanly', () => {
  const uneven = [3, 1, 2];

  // Moving down from (0, 2) into a 1-item row clamps col to 0
  assert.deepEqual(navigateGrid(uneven, { row: 0, col: 2 }, 'ArrowDown'), { row: 1, col: 0 });
  // Moving up from (2, 1) into a 1-item row clamps col to 0
  assert.deepEqual(navigateGrid(uneven, { row: 2, col: 1 }, 'ArrowUp'), { row: 1, col: 0 });
  // Moving down from (1, 0) into row 2 stays at (2, 0)
  assert.deepEqual(navigateGrid(uneven, { row: 1, col: 0 }, 'ArrowDown'), { row: 2, col: 0 });
  // Empty grid
  assert.deepEqual(navigateGrid([], { row: 1, col: 1 }, 'ArrowRight'), { row: 0, col: 0 });
});

// --- trapModalFocus ---
test('trapModalFocus wraps forward and backward within modal focusable count', () => {
  const count = 4;

  // Forward wrapping: 0 -> 1 -> 2 -> 3 -> 0
  assert.equal(trapModalFocus(count, 0, 'ArrowDown'), 1);
  assert.equal(trapModalFocus(count, 1, 'ArrowRight'), 2);
  assert.equal(trapModalFocus(count, 2, 'next'), 3);
  assert.equal(trapModalFocus(count, 3, 'ArrowDown'), 0);

  // Backward wrapping: 0 -> 3 -> 2
  assert.equal(trapModalFocus(count, 0, 'ArrowUp'), 3);
  assert.equal(trapModalFocus(count, 0, 'ArrowLeft'), 3);
  assert.equal(trapModalFocus(count, 0, 'prev'), 3);
  assert.equal(trapModalFocus(count, 3, 'ArrowUp'), 2);

  // Edge case: zero count
  assert.equal(trapModalFocus(0, 2, 'ArrowDown'), 0);
});

// --- formatClock & formatIndonesianDate ---
test('formatClock formats 24-hour HH:MM with zero-padding', () => {
  assert.equal(formatClock(new Date(2026, 10, 18, 0, 0)), '00:00');
  assert.equal(formatClock(new Date(2026, 10, 18, 8, 5)), '08:05');
  assert.equal(formatClock(new Date(2026, 10, 18, 21, 45)), '21:45');
});

test('formatIndonesianDate formats day name, date, Indonesian month, and year', () => {
  // 18 November 2026 is a Wednesday (Rabu)
  assert.equal(formatIndonesianDate(new Date(2026, 10, 18)), 'Rabu, 18 November 2026');
  // 4 January 2026 is a Sunday (Minggu)
  assert.equal(formatIndonesianDate(new Date(2026, 0, 4)), 'Minggu, 4 Januari 2026');
});

console.log(`\nAll ${passed} tests passed.`);
