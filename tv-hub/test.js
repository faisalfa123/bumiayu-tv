'use strict';

const assert = require('assert/strict');
const {
  STORAGE_KEY,
  ROW_COL_COUNTS,
  DEFAULT_CONFIG,
  normalizeUrl,
  loadConfig,
  saveConfig,
  navigateGrid,
  trapModalFocus,
  formatClock,
  formatIndonesianDate,
  toggleAmbientState,
} = require('./app.js');
const {
  THEME_STORAGE_KEY,
  BUMIAYU_THEMES,
  normalizeThemeId,
  getThemeMeta,
  loadTheme,
  saveTheme,
} = require('./themes.js');
const {
  DEFAULT_CHANNELS,
  parseM3U,
  hashSecret,
  isAdultTabVisible,
  loadLockConfig,
  saveLockConfig,
  verifyLockSecret,
  sortChannelsWithFavorites,
} = require('./webtv.js');

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
  assert.equal(normalizeUrl('https://senandung.home.arpa///', DEFAULT_CONFIG.senandung), 'https://senandung.home.arpa');
  assert.equal(normalizeUrl('  HTTP://nas.local:8080/  ', DEFAULT_CONFIG.senandung), 'HTTP://nas.local:8080');
});

test('normalizeUrl falls back when input is empty, whitespace, or non-string', () => {
  assert.equal(normalizeUrl('', DEFAULT_CONFIG.senandung), DEFAULT_CONFIG.senandung);
  assert.equal(normalizeUrl('   ', DEFAULT_CONFIG.senandung), DEFAULT_CONFIG.senandung);
  assert.equal(normalizeUrl(null, DEFAULT_CONFIG.senandung), DEFAULT_CONFIG.senandung);
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
    },
    mockStorage
  );

  const expected = {
    senandung: 'http://10.0.0.10:8080',
  };

  assert.deepEqual(saved, expected);
  assert.deepEqual(loadConfig(mockStorage), expected);
});

test('loadConfig and saveConfig fall back to DEFAULT_CONFIG for omitted fields', () => {
  const mockStorage = createMockStorage();
  saveConfig({}, mockStorage);
  assert.deepEqual(loadConfig(mockStorage), {
    senandung: DEFAULT_CONFIG.senandung,
  });
});

// --- navigateGrid ---
test('navigateGrid moves across ROW_COL_COUNTS [1, 4, 4] and clamps at all boundaries', () => {
  const grid = ROW_COL_COUNTS; // [1, 4, 4]

  // Row 0 has only 1 item (col 0): Left/Right clamp to 0
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowLeft'), { row: 0, col: 0 });
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowRight'), { row: 0, col: 0 });
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowUp'), { row: 0, col: 0 });

  // Move down to Row 1
  assert.deepEqual(navigateGrid(grid, { row: 0, col: 0 }, 'ArrowDown'), { row: 1, col: 0 });

  // Moving horizontally across Row 1 (4 items)
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 0 }, 'ArrowRight'), { row: 1, col: 1 });
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 1 }, 'ArrowRight'), { row: 1, col: 2 });
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 2 }, 'ArrowRight'), { row: 1, col: 3 });
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 3 }, 'ArrowRight'), { row: 1, col: 3 }); // clamps at 3

  // Moving up from (1, 3) to Row 0 clamps col to 0 (since Row 0 length is 1)
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 3 }, 'ArrowUp'), { row: 0, col: 0 });

  // Moving down from (1, 2) to Row 2 preserves col 2
  assert.deepEqual(navigateGrid(grid, { row: 1, col: 2 }, 'ArrowDown'), { row: 2, col: 2 });

  // Row 2 boundary clamping
  assert.deepEqual(navigateGrid(grid, { row: 2, col: 3 }, 'ArrowRight'), { row: 2, col: 3 });
  assert.deepEqual(navigateGrid(grid, { row: 2, col: 3 }, 'ArrowDown'), { row: 2, col: 3 });
});

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

test('formatClock supports optional seconds pulse colon', () => {
  const tickDate = new Date(2026, 10, 18, 14, 30, 10); // even second -> tick
  const tockDate = new Date(2026, 10, 18, 14, 30, 11); // odd second -> tock
  assert.equal(
    formatClock(tickDate, true),
    '14<span class="clock-colon tick">:</span>30'
  );
  assert.equal(
    formatClock(tockDate, true),
    '14<span class="clock-colon tock">:</span>30'
  );
});

test('toggleAmbientState toggles and sets lockscreen visibility accurately', () => {
  assert.equal(toggleAmbientState(false), true);
  assert.equal(toggleAmbientState(true), false);
  assert.equal(toggleAmbientState(false, true), true);
  assert.equal(toggleAmbientState(true, false), false);
  assert.equal(toggleAmbientState(false, false), false);
});

test('formatIndonesianDate formats day name, date, Indonesian month, and year', () => {
  // 18 November 2026 is a Wednesday (Rabu)
  assert.equal(formatIndonesianDate(new Date(2026, 10, 18)), 'Rabu, 18 November 2026');
  // 4 January 2026 is a Sunday (Minggu)
  assert.equal(formatIndonesianDate(new Date(2026, 0, 4)), 'Minggu, 4 Januari 2026');
});

// --- themes.js: normalizeThemeId / loadTheme / saveTheme ---
test('BUMIAYU_THEMES defines the 4 anime-retro themes and normalizeThemeId validates ids', () => {
  assert.deepEqual(
    BUMIAYU_THEMES.map((t) => t.id),
    ['pixel', 'asri', 'samudra', 'rintik']
  );
  assert.equal(normalizeThemeId('pixel'), 'pixel');
  assert.equal(normalizeThemeId('asri'), 'asri');
  assert.equal(normalizeThemeId('samudra'), 'samudra');
  assert.equal(normalizeThemeId('rintik'), 'rintik');
  assert.equal(normalizeThemeId('  ASRI  '), 'asri');

  // Invalid or empty values fall back to 'pixel'
  assert.equal(normalizeThemeId(''), 'pixel');
  assert.equal(normalizeThemeId('unknown-theme'), 'pixel');
  assert.equal(normalizeThemeId(null), 'pixel');
  assert.equal(normalizeThemeId(undefined), 'pixel');
  assert.equal(normalizeThemeId(42), 'pixel');
});

test('loadTheme and saveTheme persist normalized theme id with mock localStorage', () => {
  assert.equal(loadTheme(null), 'pixel');
  assert.equal(loadTheme(createMockStorage()), 'pixel');
  assert.equal(loadTheme(createMockStorage({ [THEME_STORAGE_KEY]: 'invalid' })), 'pixel');

  const mockStorage = createMockStorage();
  assert.equal(saveTheme('samudra', mockStorage), 'samudra');
  assert.equal(mockStorage.getItem(THEME_STORAGE_KEY), 'samudra');
  assert.equal(loadTheme(mockStorage), 'samudra');

  assert.equal(saveTheme('unknown', mockStorage), 'pixel');
  assert.equal(loadTheme(mockStorage), 'pixel');
});

// --- webtv.js: parseM3U ---
test('parseM3U parses EXTINF channel names, URLs, and infers hls vs web stream types', () => {
  const playlist = [
    '#EXTM3U',
    '#EXTINF:-1 tvg-id="tvri" group-title="Nasional",TVRI Nasional',
    'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8',
    '#EXTINF:-1 tvg-logo="https://example.com/logo.png",Kompas TV Live',
    'https://www.kompas.tv/live',
    '#EXTINF:-1,Stream Tokenized',
    'https://cdn.example.com/live/stream.m3u8?token=xyz',
  ].join('\n');

  const parsed = parseM3U(playlist, 'internasional');
  assert.equal(parsed.length, 3);

  assert.equal(parsed[0].name, 'TVRI Nasional');
  assert.equal(parsed[0].url, 'https://ott-balancer.tvri.go.id/live/eds/Nasional/hls/Nasional.m3u8');
  assert.equal(parsed[0].type, 'hls');
  assert.equal(parsed[0].category, 'internasional');

  assert.equal(parsed[1].name, 'Kompas TV Live');
  assert.equal(parsed[1].url, 'https://www.kompas.tv/live');
  assert.equal(parsed[1].type, 'web');
  assert.equal(parsed[1].category, 'internasional');

  assert.equal(parsed[2].name, 'Stream Tokenized');
  assert.equal(parsed[2].type, 'hls');

  assert.deepEqual(parseM3U(''), []);
  assert.deepEqual(parseM3U(null), []);
});

// --- webtv.js: hashSecret / loadLockConfig / saveLockConfig / verifyLockSecret ---
test('hashSecret is deterministic and distinct for different secrets', () => {
  const h1 = hashSecret('1234');
  const h2 = hashSecret('1234');
  const h3 = hashSecret('9876');

  assert.equal(typeof h1, 'string');
  assert.ok(h1.length > 0);
  assert.equal(h1, h2);
  assert.notEqual(h1, h3);
});

test('loadLockConfig returns isConfigured: false when empty, saveLockConfig sets isConfigured: true, and verifyLockSecret works', () => {
  const defaultCfg = loadLockConfig(createMockStorage());
  assert.equal(defaultCfg.isConfigured, false);
  assert.equal(defaultCfg.mode, 'pin');
  assert.equal(defaultCfg.hash, null);
  assert.equal(defaultCfg.hideAdultTab, true);
  assert.equal(verifyLockSecret('1234', defaultCfg), false);
  assert.equal(verifyLockSecret('0000', defaultCfg), false);
  assert.equal(verifyLockSecret('', defaultCfg), false);
  assert.equal(verifyLockSecret(null, defaultCfg), false);

  // Corrupt JSON falls back safely to unconfigured state
  const corruptCfg = loadLockConfig(createMockStorage({ bumiayu_lock_config: '{bad-json' }));
  assert.equal(corruptCfg.isConfigured, false);
  assert.equal(verifyLockSecret('1234', corruptCfg), false);

  // Custom PIN + isConfigured persistence
  const mockStorage = createMockStorage();
  const savedPin = saveLockConfig(
    { isConfigured: true, mode: 'pin', hash: hashSecret('4321'), hideAdultTab: true },
    mockStorage
  );
  assert.equal(savedPin.isConfigured, true);
  assert.equal(savedPin.mode, 'pin');
  assert.equal(savedPin.hideAdultTab, true);
  const reloadedPin = loadLockConfig(mockStorage);
  assert.equal(reloadedPin.isConfigured, true);
  assert.equal(reloadedPin.hideAdultTab, true);
  assert.equal(verifyLockSecret('4321', reloadedPin), true);
  assert.equal(verifyLockSecret('1234', reloadedPin), false);

  // Pattern mode (UP,UP,DOWN,RIGHT)
  const savedPattern = saveLockConfig(
    { isConfigured: true, mode: 'pattern', hash: hashSecret('UP,UP,DOWN,RIGHT'), hideAdultTab: true },
    mockStorage
  );
  assert.equal(savedPattern.isConfigured, true);
  assert.equal(savedPattern.mode, 'pattern');
  const reloadedPattern = loadLockConfig(mockStorage);
  assert.equal(reloadedPattern.isConfigured, true);
  assert.equal(reloadedPattern.mode, 'pattern');
  assert.equal(reloadedPattern.hideAdultTab, true);
  assert.equal(verifyLockSecret('UP,UP,DOWN,RIGHT', reloadedPattern), true);
  assert.equal(verifyLockSecret(['UP', 'UP', 'DOWN', 'RIGHT'], reloadedPattern), true);
  assert.equal(verifyLockSecret(['UP', 'DOWN', 'DOWN', 'RIGHT'], reloadedPattern), false);
});

// --- webtv.js: sortChannelsWithFavorites ---
test('sortChannelsWithFavorites pins favorite channels first while preserving relative order', () => {
  const sample = DEFAULT_CHANNELS.nasional;
  assert.ok(sample.length >= 4);

  const favIds = [sample[3].id, sample[1].id];
  const sorted = sortChannelsWithFavorites(sample, favIds);

  assert.equal(sorted.length, sample.length);
  // Favorites appear first in their original relative order: sample[1], sample[3]
  assert.equal(sorted[0].id, sample[1].id);
  assert.equal(sorted[1].id, sample[3].id);
  // Remaining channels preserve their original relative order
  assert.equal(sorted[2].id, sample[0].id);
  assert.equal(sorted[3].id, sample[2].id);

  // Empty favorites preserves original order
  assert.deepEqual(
    sortChannelsWithFavorites(sample, []).map((c) => c.id),
    sample.map((c) => c.id)
  );
});

// --- webtv.js: isAdultTabVisible & stealth checks ---
test('18+ tab is never visible in default public category tabs and stealth session lock', () => {
  // Default lock config has hideAdultTab: true and isConfigured: false
  const def = loadLockConfig(createMockStorage());
  assert.equal(isAdultTabVisible(def, false), false);
  assert.equal(isAdultTabVisible(def, true), false);

  // Even if configured, when hideAdultTab is true (stealth mode), public tab is never visible
  const configuredStealth = { isConfigured: true, mode: 'pin', hash: hashSecret('4321'), hideAdultTab: true };
  assert.equal(isAdultTabVisible(configuredStealth, false), false);
  assert.equal(isAdultTabVisible(configuredStealth, true), false);

  // Adult channels unlock only with valid secret in a session
  assert.equal(verifyLockSecret('4321', configuredStealth), true);
  assert.equal(verifyLockSecret('0000', configuredStealth), false);
});

test('getThemeMeta returns metadata for valid themes and falls back to pixel', () => {
  assert.equal(getThemeMeta('asri').id, 'asri');
  assert.equal(getThemeMeta('samudra').id, 'samudra');
  assert.equal(getThemeMeta('rintik').id, 'rintik');
  assert.equal(getThemeMeta('unknown-theme').id, 'pixel');
});

test('DEFAULT_CHANNELS provides direct HLS .m3u8 streams with no web embeds', () => {
  assert.ok(DEFAULT_CHANNELS.nasional.length >= 6);
  assert.ok(DEFAULT_CHANNELS.internasional.length >= 4);

  // Verify all channels in nasional and internasional are direct HLS (.m3u8) streams
  const allMain = DEFAULT_CHANNELS.nasional.concat(DEFAULT_CHANNELS.internasional);
  for (const ch of allMain) {
    assert.equal(ch.type, 'hls', `Channel ${ch.name} should have type: hls`);
    assert.ok(ch.url.includes('.m3u8'), `Channel ${ch.name} URL should contain .m3u8: ${ch.url}`);
  }

  // Key required channels exist
  const names = allMain.map((c) => c.name.toLowerCase());
  assert.ok(names.some((n) => n.includes('tvri nasional')));
  assert.ok(names.some((n) => n.includes('kompas')));
  assert.ok(names.some((n) => n.includes('metro')));
  assert.ok(names.some((n) => n.includes('tvone')));
  assert.ok(names.some((n) => n.includes('rtv')));
  assert.ok(names.some((n) => n.includes('trans7')));
  assert.ok(names.some((n) => n.includes('nhk world')));
  assert.ok(names.some((n) => n.includes('al jazeera')));
  assert.ok(names.some((n) => n.includes('dw english')));
  assert.ok(names.some((n) => n.includes('france 24')));
});

test('parseM3U auto-classifies adult / 18+ / XXX streams into adult category', () => {
  const m3uSample = `
#EXTM3U
#EXTINF:-1 tvg-id="ch1" group-title="Indonesian TV",TVRI Nasional
https://example.com/tvri.m3u8
#EXTINF:-1 tvg-id="ch2" group-title="Adult 18+",Red Light HD
https://example.com/adult1.m3u8
#EXTINF:-1 tvg-id="ch3",Midnight XXX Special
https://example.com/adult2.m3u8
#EXTINF:-1 tvg-id="ch4" group-title="News",CNN International
https://example.com/cnn.m3u8
`;

  const parsed = parseM3U(m3uSample, 'nasional');
  assert.equal(parsed.length, 4);

  const tvri = parsed.find((c) => c.name === 'TVRI Nasional');
  assert.ok(tvri);
  assert.equal(tvri.category, 'nasional');

  const adult1 = parsed.find((c) => c.name === 'Red Light HD');
  assert.ok(adult1);
  assert.equal(adult1.category, 'adult');

  const adult2 = parsed.find((c) => c.name === 'Midnight XXX Special');
  assert.ok(adult2);
  assert.equal(adult2.category, 'adult');

  const cnn = parsed.find((c) => c.name === 'CNN International');
  assert.ok(cnn);
  assert.equal(cnn.category, 'nasional');
});

console.log(`\nAll ${passed} tests passed.`);
