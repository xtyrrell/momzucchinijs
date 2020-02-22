export default function parseModes (source) {
  const borges = /ok i.?m .* ?Borges now/gi.test(source)
  const paradise = /welcome (2|to) paradi(s|c)e/gi.test(source)
  const chile = /husband from Chile/gi.test(source)
  const tarot = /Tarot de Marseille/gi.test(source)
  const goodNight = /good night/gi.test(source)
  const todont = /todon'?t/gi.test(source)
  const moody = /心情不稳的/gi.test(source)

  return {
    borges,
    paradise,
    chile,
    tarot,
    goodNight,
    todont,
    moody
  }
}
