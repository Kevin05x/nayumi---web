import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// Exercise the actual animation renderer without a browser or a copied formula.
const source = await readFile(new URL('../src/scripts/motion.js', import.meta.url), 'utf8');
const begin = source.indexOf('  function paintStack(position) {');
const end = source.indexOf('  function tickStack(now) {', begin);
assert.ok(begin >= 0 && end > begin);
const cards = Array.from({ length: 4 }, () => ({ style: {}, inert: false }));
const stops = Array.from({ length: 4 }, () => ({ style: { setProperty() {} }, setAttribute() {} }));
const controls = { '.stack-counter': {}, '.stack-name': {} };
const names = ['Niñeras', 'Cuidado de adulto mayor', 'Cocina', 'Limpieza'];
const state = { height: 530, active: -1 };
const arrows = [{}, {}];
const context = vm.createContext({
  stackCards: cards,
  stackStops: stops,
  stackState: state,
  stackNames: names,
  stackArrows: arrows,
  stack: { querySelector: (name) => controls[name] },
  clamp: (value, min = 0, max = 1) => Math.min(max, Math.max(min, value)),
});
vm.runInContext(source.slice(begin, end), context);
let checks = 0;
for (const direction of [1, -1]) {
  let previous = direction === 1 ? 0 : 3;
  for (let step = 0; step <= 300; step++) {
    const position = direction === 1 ? step / 100 : 3 - step / 100;
    context.paintStack(position);
    assert.equal(cards.filter((card) => !card.inert).length, 1, 'Exactly one interactive service');
    assert.ok(
      (state.active - previous) * direction >= 0,
      'Active service follows scroll direction',
    );
    assert.equal(controls['.stack-name'].textContent, names[state.active]);
    assert.equal(arrows[0].disabled, state.active === 0);
    assert.equal(arrows[1].disabled, state.active === 3);
    for (const card of cards) {
      assert.ok(!/NaN|Infinity/.test(card.style.transform + card.style.filter));
      assert.ok(Number(card.style.opacity) >= 0 && Number(card.style.opacity) <= 1);
    }
    previous = state.active;
    checks++;
  }
}
context.paintStack(0);
assert.equal(cards[0].style.transform, 'translate3d(0,0.00px,0) scale(1.0000) rotate(0.000deg)');
assert.equal(cards[1].style.visibility, 'hidden');
context.paintStack(3);
assert.equal(cards[3].style.transform, 'translate3d(0,0.00px,0) scale(1.0000) rotate(0.000deg)');
assert.equal(cards[0].inert, true);
console.log(
  `Scroll Stack: ${checks} estados de avance y retroceso válidos; extremos, accesibilidad de tarjetas y controles verificados. Sin prueba de navegador.`,
);
