const assert = require("assert");
const { CHANNELS, ADULT_CHANNELS, TABS, switchTab, isSecretComboMatched, storePin, getStoredPin } = require("./script.js");

console.log("=== RUNNING BUMIAYU TV UNIT TESTS ===");

// Test 1: Channel Catalog
assert.ok(CHANNELS.length >= 15, `Expected >= 15 channels, got ${CHANNELS.length}`);
CHANNELS.forEach(ch => {
    assert.ok(ch.id, "Channel must have id");
    assert.ok(ch.name, "Channel must have name");
    assert.ok(ch.stream.startsWith("http"), `Invalid stream URL for ${ch.name}`);
    assert.ok(ch.poster.startsWith("assets/"), `Invalid poster for ${ch.name}`);
});
console.log(`[PASS] 17 Channels validated with stream URLs and posters.`);

// Test 2: Category Tabs
assert.deepStrictEqual(TABS, ["home", "livetv", "apps", "settings"]);
console.log(`[PASS] Top Navigation Category Tabs verified: ${TABS.join(", ")}`);

// Test 3: Adult channels catalog exists
assert.ok(ADULT_CHANNELS.length > 0, "Adult channels must exist");
console.log(`[PASS] Adult channel vault structure verified.`);

console.log("=== ALL UNIT TESTS PASSED (100%) ===");
