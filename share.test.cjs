"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Share = require("./share.js");

test("encode/decode roundtrip for win, bleed, and map cards", () => {
  const payloads = [
    { t: "win", n: "Planet Fitness", a: 22, d: "2026-09-02", s: "planet-fitness" },
    { t: "bleed", y: 4284, c: 6 },
    { t: "map", n: "SiriusXM", s: "siriusxm", cat: "Music", trap: "Retention is the product." },
  ];
  for (const payload of payloads) {
    const token = Share.encodeCard(payload);
    assert.equal(token.includes("+"), false);
    assert.equal(token.includes("/"), false);
    assert.deepEqual(Share.decodeCard(token), Object.assign({ v: 1 }, payload));
  }
});

test("decode rejects junk, missing type, and wrong version", () => {
  assert.equal(Share.decodeCard(""), null);
  assert.equal(Share.decodeCard("not-base64"), null);
  const badType = Share.encodeCard({ t: "win", n: "X", a: 1 });
  const decoded = Share.decodeCard(badType);
  assert.equal(decoded.t, "win");
  const tampered = Buffer.from(JSON.stringify({ v: 2, t: "win", n: "X" })).toString("base64url");
  assert.equal(Share.decodeCard(tampered), null);
  const noType = Buffer.from(JSON.stringify({ v: 1, n: "X" })).toString("base64url");
  assert.equal(Share.decodeCard(noType), null);
});

test("captions are the thing people actually paste", () => {
  const win = { t: "win", n: "Adobe", a: 55 };
  const bleed = { t: "bleed", y: 2400, c: 4 };
  const map = { t: "map", n: "Xfinity" };
  const url = "https://example.test/#card=abc";
  const winCap = Share.captionFor(win, url);
  assert.match(winCap, /Unhooked Adobe/);
  assert.match(winCap, /\$660\/year/);
  assert.ok(winCap.includes(url));
  const bleedCap = Share.captionFor(bleed, url);
  assert.match(bleedCap, /\$2,400\/year/);
  assert.match(bleedCap, /4 subscriptions/);
  assert.match(Share.captionFor({ t: "bleed", y: 12, c: 1 }, url), /1 subscription[^s]/);
  const mapCap = Share.captionFor(map, url);
  assert.match(mapCap, /Xfinity hides the cancel button/);
});

test("card and playbook URLs stay hash/query based so they work on static hosts", () => {
  const url = Share.cardUrl({ t: "win", n: "Peloton", a: 44, d: "2026-09-02" }, "https://unhook.example");
  assert.match(url, /^https:\/\/unhook\.example\/#card=/);
  const token = url.split("#card=")[1];
  assert.equal(Share.decodeCard(token).n, "Peloton");
  assert.equal(
    Share.playbookUrl("planet-fitness", "https://unhook.example"),
    "https://unhook.example/?p=planet-fitness"
  );
});

test("money and yearly helpers", () => {
  assert.equal(Share.money(22), "$22");
  assert.equal(Share.money(4284), "$4,284");
  assert.equal(Share.yearlyFromMonthly(22), 264);
  assert.match(Share.todayISO(new Date("2026-09-02T12:00:00Z")), /^\d{4}-\d{2}-\d{2}$/);
});
