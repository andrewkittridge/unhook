"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync("./data.js", "utf8"), ctx);
const PLAYBOOKS = ctx.window.PLAYBOOKS;

test("hard-list playbooks have the fields the drawer and share cards need", () => {
  assert.ok(PLAYBOOKS.length >= 12);
  const ids = new Set();
  for (const p of PLAYBOOKS) {
    assert.ok(p.id && !ids.has(p.id), p.id);
    ids.add(p.id);
    assert.ok(p.name);
    assert.ok(["hard", "mid", "easy"].includes(p.difficulty), p.name);
    assert.ok(p.trap && p.blurb && p.path);
    assert.ok(Array.isArray(p.fails) && p.fails.length >= 3);
    assert.ok(Array.isArray(p.steps) && p.steps.length >= 3);
    assert.ok(Array.isArray(p.script) && p.script.length >= 2);
    p.script.forEach((line) => {
      assert.ok(line.who === "you" || line.who === "them", p.name);
      assert.ok(line.text);
    });
    p.steps.forEach((s) => {
      assert.ok(s.title && s.body, p.name);
    });
    assert.ok(p.letter && p.letter.body && p.letter.subject);
    assert.ok(p.letter.body.includes("{{fullName}}"));
    assert.ok(typeof p.typical === "number" && p.typical > 0);
    assert.ok(p.cancelBy && p.cancelBy.hint);
  }
});

test("hero companies from the original search box are on the list", () => {
  const ids = PLAYBOOKS.map((p) => p.id);
  ["planet-fitness", "siriusxm", "adobe", "xfinity"].forEach((id) => {
    assert.ok(ids.includes(id), id);
  });
});
